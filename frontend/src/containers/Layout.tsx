import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Menu from '../components/menu/Menu';
import SlidingMenu from '../components/menu/SlidingMenu';
import { classNames } from '../common/helpers/tailwind.helper';

// Compoment that serves as the layout for the app. Everything will be rendered with a header and a side menu.
const Layout = () => {
  const [isSlidingMenuOpen, setSlidingMenuOpen] = useState<boolean>(false);
  const [isNarrow, setIsNarrow] = useState(false);

  return (
    <div className="w-screen h-screen max-w-full">
      <Header openSlidingMenu={setSlidingMenuOpen} />
      <SlidingMenu isOpen={isSlidingMenuOpen} setSlidingMenuOpen={setSlidingMenuOpen} />
      <div className="flex flex-row sm:p-6 p-4 gap-6 xl:gap-4">
        <div className={classNames(isNarrow ? 'xl:w-[5.5rem]' : 'xl:w-64', "menu hidden xl:flex xl:flex-shrink-0 ")}>
          <Menu isNarrow={isNarrow} setIsNarrow={setIsNarrow} />
        </div>
        <div className={classNames(isNarrow ? 'xl:w-[calc(100%-5.5rem)]' : 'xl:w-[calc(100%-17rem)]', "content ")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
