import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChartOption, CHART_COLORS, DataSet } from '../../../components/line-chart/chart.config';
import LineChart from '../../../components/line-chart/LineChart';
import { Loading } from '../../../components/loading/Loading';
import { useRequestStatistics } from '../../../services/statistics/statistics.queries';
import StatisticsErrorBanner from './StatisticsErrorBanner';

const RequestsLineChart = () => {
  const [labels, setLabels] = useState<string[]>([]);
  const [datasets, setDatasets] = useState<DataSet[]>([]);
  const [activeFilter, setActiveFilter] = useState<ChartOption>(ChartOption.MONTHLY);

  const { t } = useTranslation(['dashboard']);

  const { data, isLoading, error } = useRequestStatistics(activeFilter);

  useEffect(() => {
    if (data) {
      // build data set
      const { approved, declined, labels } = data;
      setLabels(labels);
      buildDatasets(approved, declined);
    }
  }, [data]);

  const buildDatasets = (approved: number[], declined: number[]) => {
    setDatasets([
      {
        label: t('statistics.accepted_requests'),
        data: approved,
        borderColor: CHART_COLORS.ACTIVE,
        backgroundColor: CHART_COLORS.ACTIVE,
      },
      {
        label: t('statistics.rejected_requests'),
        data: declined,
        borderColor: CHART_COLORS.INACTIVE,
        backgroundColor: CHART_COLORS.INACTIVE,
      },
    ]);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <StatisticsErrorBanner message={t('statistics.requests_statistics_error')} />;
  }

  return (
    <LineChart
      data={{ datasets, labels }}
      title={t('statistics.request_chart')}
      activeFiler={activeFilter}
      onUpdateChart={(filter) => setActiveFilter(filter)}
    />
  );
};

export default RequestsLineChart;
