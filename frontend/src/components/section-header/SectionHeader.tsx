import React from 'react';

interface SectionHeaderProps {
  title: string;
  subTitle?: string;
}

const SectionHeader = ({ title, subTitle }: SectionHeaderProps) => (
  <div>
    <span className="font-bold sm:text-lg lg:text-xl text-md text-default-gray-900">{title}</span>
    <p className="font-normal lg:text-base text-xs text-default-gray-500">{subTitle || ''}</p>
  </div>
);

export default SectionHeader;
