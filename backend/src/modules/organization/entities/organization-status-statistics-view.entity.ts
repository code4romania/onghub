import { ViewColumn, ViewEntity } from 'typeorm';
import { OrganizationStatisticsType } from '../enums/organization-statistics-type.enum';
import { OrganizationStatus } from '../enums/organization-status.enum';

@ViewEntity('OrganizationStatusStatisticsView', {
  expression: `with 
date_day_series as (
    select 
        date_trunc('day', (current_date - offs)) as day
    from generate_series(0, 365*5, 1) as offs),

--generates month series for the last 5 years from current_date
date_month_series as (
    select 
		distinct date_trunc('month', day) as month 
    from date_day_series
),

--generates year series for the last 5 years from current date
date_year_series as (
    select 
		distinct date_trunc('year', month) as year 
    from date_month_series
)

--returns the latest status for each day
select 
    to_char(date_trunc('day', daily_status.day), 'DD Mon') as date,
    daily_status.status,
    case 
        when daily_status.status is not null 
            then count(*) 
        else 0
    end as count,
    'daily' as type
from (
    --ranking of the statuses/days
    select
        rank() over (
            partition by day_series.day, 
                         org_hist.history_original_id
            order by org_hist.updated_on desc
        ) as rnk,
        day_series.day,
        org_hist.status,
        org_hist.updated_on,
        org_hist.history_original_id

    from date_day_series day_series

    left join "organization_history" org_hist
        on date_trunc('day', org_hist.updated_on) <= day_series.day

    where day_series.day > date_trunc('day', (current_date - 30))
    ) daily_status
where daily_status.rnk = 1

group by daily_status.day, 
         daily_status.status

union all 
--returns the latest status for each month
select 
    to_char(date_trunc('month', monthly_status.month), 'Mon YY') as date,
    monthly_status.status,
    case 
        when monthly_status.status is not null 
            then count(*) 
        else 0
    end as count,
    'monthly' as type 
from (
    --ranking of the statuses/months
    select
        rank() over (
            partition by month_series.month, 
                         org_hist.history_original_id
            order by org_hist.updated_on desc
        ) as rnk,
        month_series.month,
        org_hist.status,
        org_hist.updated_on,
        org_hist.history_original_id

    from date_month_series month_series

    left join "organization_history" org_hist
        on date_trunc('month', org_hist.updated_on) <= date_trunc('month', month_series.month)
    
    where date_trunc('month', month_series.month) > date_trunc('day', (current_date - 365))
    ) monthly_status
where monthly_status.rnk=1

group by monthly_status.month, 
         monthly_status.status
union all
--returns the latest status for each year
select 
    to_char(date_trunc('year', yearly_status.year), 'YYYY') as date,
    yearly_status.status,
    case 
        when yearly_status.status is not null 
            then count(*) 
        else 0
    end as count,
    'yearly' as type 
from (
    --ranking of the statuses/years
    select
        rank() over (
            partition by year_series.year, 
                         org_hist.history_original_id
            order by org_hist.updated_on desc
        ) as rnk,
        year_series.year,
        org_hist.status,
        org_hist.updated_on,
        org_hist.history_original_id

    from date_year_series year_series

    left join "organization_history" org_hist
        on date_trunc('year', org_hist.updated_on) <= date_trunc('year', year_series.year)
    
    where date_trunc('year', year_series.year) > date_trunc('year', (current_date - 365*5))
    ) yearly_status
where yearly_status.rnk=1
group by yearly_status.year, yearly_status.status
  `,
})
export class OrganizationStatusStatisticsView {
  @ViewColumn()
  date: string;

  @ViewColumn()
  status: OrganizationStatus;

  @ViewColumn()
  count: number;

  @ViewColumn()
  type: OrganizationStatisticsType;
}
