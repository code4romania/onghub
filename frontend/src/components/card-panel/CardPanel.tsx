import React from 'react';

interface CardPanelProps {
  title: string;
  children?: JSX.Element;
}

const CardPanel = ({ title, children }: CardPanelProps) => {
  return (
    <div className="w-full bg-white shadow rounded-lg">
      <div className="p-5 sm:p-10 flex justify-between">
        <span className="font-titilliumBold text-xl text-gray-800">{title}</span>
      </div>

      <div className="w-full border-t border-gray-300" />
      <div className="md:py-5 md:px-10 sm:p-10">{children}</div>
    </div>
  );
};

export default CardPanel;
