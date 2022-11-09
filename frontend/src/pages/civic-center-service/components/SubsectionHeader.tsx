import React from 'react';

interface SubsectionHeaderProps {
  title: string;
  description: string;
}

const SubsectionHeader = ({ title, description }: SubsectionHeaderProps) => {
  return (
    <div className="flex flex-col">
      <h3 className="font-bold text-xl">{title}</h3>
      <p className="text-gray-500 text-base font-normal">{description}</p>
    </div>
  );
};

export default SubsectionHeader;
