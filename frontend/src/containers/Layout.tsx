import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Menu from '../components/menu/Menu';
import Example from '../components/menu/SlidingMenu';

// Compoment that serves as the layout for the app. Everything will be rendered with a header and a side menu.
const Layout = () => {
  return (
    <div className="w-screen h-screen max-w-full ">
      <Example />
      <Header />
      <div className="flex p-6">
        <div className="menu">
          <Menu />
        </div>
        <div className="content overflow-scroll w-full pl-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
