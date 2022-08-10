import React, { useState } from 'react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

const DateRangePicker = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  return (
    <div className="relative w-full">
      {/* {props.config.label && (
        <label htmlFor="email" className="block text-base font-medium text-gray-700">
          {props.config.label}
        </label>
      )} */}
      <label className="block text-base font-medium text-gray-700">Selecteaza data</label>
      <div className="mt-1 relative rounded-md">
        <DatePicker
          className="pl-10 block w-full pr-10 border-gray-300 shadow-sm  sm:text-base text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          selectsRange={true}
          startDate={startDate}
          endDate={endDate}
          onChange={(update: any[]) => {
            setDateRange(update);
          }}
          isClearable={false}
        />
      </div>
    </div>
  );
};

export default DateRangePicker;
