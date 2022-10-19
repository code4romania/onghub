import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Menu from '../components/menu/Menu';
import SlidingMenu from '../components/menu/SlidingMenu';

// Compoment that serves as the layout for the app. Everything will be rendered with a header and a side menu.
const Layout = () => {
  const [isSlidingMenuOpen, setSlidingMenuOpen] = useState<boolean>(false);

  return (
    <div className="w-screen h-screen max-w-full ">
      <Header openSlidingMenu={setSlidingMenuOpen} />
      <SlidingMenu isOpen={isSlidingMenuOpen} setSlidingMenuOpen={setSlidingMenuOpen} />
      <div className="flex sm:p-6 p-4">
        <div className="menu hidden lg:flex">
          <Menu />
        </div>
        <div className="content w-full lg:pl-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
