import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ChartOption, CHART_FILTER_OPTIONS, DataSet, LINE_CHART_OPTIONS } from './chart.config';
import { useTranslation } from 'react-i18next';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
  title: string;
  data: {
    labels: string[];
    datasets: DataSet[];
  };
  activeFiler?: ChartOption;
  onUpdateChart: (filter: ChartOption) => void;
}

const LineChart = ({ data, title, activeFiler, onUpdateChart }: LineChartProps) => {
  const { t } = useTranslation(['dashboard']);

  const onFilterChange = (item: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateChart(item.target.value as ChartOption);
  };

  return (
    <div className="lg:w-2/5 w-full">
      <div className="shadow-lg rounded-lg overflow-hidden bg-white max-w-4xl max-h-128 divide-y divide-gray-200 ">
        <div className="py-5 sm:px-8 px-5 flex flex-row justify-between items-center">
          <span className="font-titilliumBold sm:text-lg lg:text-xl text-sm text-gray-800">
            {title}
          </span>
          <div>
            <select
              id="location"
              name="location"
              defaultValue={activeFiler || ChartOption.MONTHLY}
              className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 sm:text-sm lg:text-base text-xs focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              onChange={onFilterChange}
            >
              {CHART_FILTER_OPTIONS.map((item) => (
                <option key={item.key} value={item.key}>
                  {t(item.label)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="sm:pt-4 sm:px-8">
          <Line
            options={LINE_CHART_OPTIONS}
            data={{ labels: data.labels, datasets: data.datasets }}
          />
        </div>
      </div>
    </div>
  );
};

export default LineChart;
