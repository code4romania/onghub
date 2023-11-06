import React from 'react';
import { Tooltip } from 'react-tooltip';

interface DataTableNameHeaderProps {
  text: string;
}

const DataTableNameHeader = ({ text }: DataTableNameHeaderProps) => {
  return (
    <div className="truncate">
      <a data-tooltip-id={`row-tooltip-${text}`}>{text}</a>
      <Tooltip
        id={`row-tooltip-${text}`}
        className="break-word"
        style={{
          whiteSpace: 'pre-wrap',
          backgroundColor: '#000000',
        }}
        place="top"
        variant="info"
        content={text}
      />
    </div>
  );
};

export default DataTableNameHeader;
