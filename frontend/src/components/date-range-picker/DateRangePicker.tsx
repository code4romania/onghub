import { CalendarIcon } from '@heroicons/react/outline';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  label: string;
  defaultValue?: Date[];
  onChange?: (range: any[]) => void;
}

const DateRangePicker = ({ label, defaultValue, onChange }: DateRangePickerProps) => {
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (defaultValue) {
      setDateRange(defaultValue);
    }
  }, []);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      onChange && onChange(dateRange);
    }
  }, [dateRange]);

  return (
    <div className="relative w-full">
      <label className="block text-base font-medium text-gray-700">{label}</label>
      <div className="mt-1 relative rounded-md">
        <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none z-10">
          <CalendarIcon className="-ml-1 mr-2 h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <DatePicker
          className="block w-full pr-10 border-gray-300 shadow-sm  sm:text-base text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update: any[]) => {
            setDateRange(update);
          }}
          isClearable={false}
          placeholderText="Selectaza Interval"
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
