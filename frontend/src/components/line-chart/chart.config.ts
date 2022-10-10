export const LINE_CHART_OPTIONS = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

export enum ChartOption {
  _30_DAYS = '30-days',
  _12_MONTHS = '12-months',
  _5_YEARS = '5-years',
}

export const CHART_FILTER_OPTIONS = [
  {
    label: 'statistics.filter.anual',
    key: ChartOption._5_YEARS,
  },
  {
    label: 'statistics.filter.monthly',
    key: ChartOption._12_MONTHS,
  },
  {
    label: 'statistics.filter.daily',
    key: ChartOption._30_DAYS,
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
