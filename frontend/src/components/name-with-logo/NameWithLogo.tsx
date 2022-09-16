import React from 'react';

interface NameWithLogoProps {
  name: string;
  logo: string;
}

const NameWithLogo = ({ name, logo }: NameWithLogoProps) => {
  return (
    <div className="flex flex-row items-center">
      <div className="h-10 w-10 mr-3 ">
        <img src={logo} className="h-full w-full rounded-full" />
      </div>
      <span>{name}</span>
    </div>
  );
};

export default NameWithLogo;
