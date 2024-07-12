import { CalendarIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  label: string;
  value?: Date[];
  onChange?: (range: any[]) => void;
  id?: string;
}

const DateRangePicker = ({ label, value, onChange, id }: DateRangePickerProps) => {
  const [dateRange, setDateRange] = useState<Date[]>([]);
  const [startDate, endDate] = dateRange;

  useEffect(() => {
    if (value) {
      setDateRange(value);
    } else [setDateRange([])];
  }, [value]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      onChange && onChange(dateRange);
    }
  }, [dateRange]);

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="block font-medium text-gray-700 sm:text-sm lg:text-base text-xs"
      >
        {label}
      </label>
      <div className="mt-1 relative rounded-md">
        <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none z-10">
          <CalendarIcon
            className="-ml-1 mr-2 sm:h-5 sm:w-5 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
        </div>
        <DatePicker
          wrapperClassName="w-full"
          className="block w-full h-[44px] pr-10 border-gray-300 shadow-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm lg:text-base text-xs leading-loose"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update: any[]) => {
            setDateRange(update);
          }}
          isClearable={false}
          placeholderText="Selectaza Interval"
          id={id}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
