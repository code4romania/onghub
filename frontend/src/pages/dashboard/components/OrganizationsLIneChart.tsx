import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartOption, CHART_COLORS, DataSet } from '../../../components/line-chart/chart.config';
import LineChart from '../../../components/line-chart/LineChart';
import { useOrganizationStatistics } from '../../../services/statistics/statistics.queries';
import StatisticsErrorBanner from './StatisticsErrorBanner';

const OrganizationsLineChart = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [activeFilter, setActiveFilter] = useState<ChartOption>(ChartOption.MONTHLY);

  const { t } = useTranslation(['dashboard']);

  const { data, isLoading, error } = useOrganizationStatistics(activeFilter);

  useEffect(() => {
    if (data) {
      // build data set
      const { active, restricted, labels } = data;
      setLabels(labels);
      buildDatasets(active, restricted);
    }
  }, [data]);

  const buildDatasets = (active: number[], restricted: number[]) => {
    setDatasets([
      {
        label: t('statistics.active_organizations'),
        data: active,
        borderColor: CHART_COLORS.ACTIVE,
        backgroundColor: CHART_COLORS.ACTIVE,
      },
      {
        label: t('statistics.inactive_organizations'),
        data: restricted,
        borderColor: CHART_COLORS.INACTIVE,
        backgroundColor: CHART_COLORS.INACTIVE,
      },
    ]);
  };

  if (error) {
    return <StatisticsErrorBanner message={t('statistics.organization_statistics_error')} />;
  }

  return (
    <LineChart
      data={{ datasets, labels }}
      title={t('statistics.organization_chart')}
      activeFiler={activeFilter}
      onUpdateChart={(filter) => setActiveFilter(filter)}
      isLoading={isLoading}
    />
  );
};

export default OrganizationsLineChart;
