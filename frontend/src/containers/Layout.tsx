import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Menu from '../components/Menu/Menu';

// Compoment that serves as the layout for the app. Everything will be rendered with an header and an side menu.
const Layout = () => {
  return (
    <div className="w-screen h-screen max-w-full ">
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
