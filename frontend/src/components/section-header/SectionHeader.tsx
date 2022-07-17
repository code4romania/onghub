import React from 'react';

interface SectionHeaderProps {
  title: string;
  subTitle?: string;
}

const SectionHeader = ({ title, subTitle }: SectionHeaderProps) => (
  <div>
    <span className="font-bold text-xl text-default-gray-900">{title}</span>
    <p className="font-normal text-base text-default-gray-500">{subTitle || ''}</p>
  </div>
);

export default SectionHeader;
