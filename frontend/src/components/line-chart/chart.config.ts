export const LINE_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

export enum ChartOption {
  DAILY = 'daily',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export const CHART_FILTER_OPTIONS = [
  {
    label: 'statistics.filter.yearly',
    key: ChartOption.YEARLY,
  },
  {
    label: 'statistics.filter.monthly',
    key: ChartOption.MONTHLY,
  },
  {
    label: 'statistics.filter.daily',
    key: ChartOption.DAILY,
  },
];

export interface DataSet {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor: string;
}

export const CHART_COLORS = {
  ACTIVE: '#1FD19C',
  INACTIVE: '#DF5858',
};
