import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import Menu from '../components/menu/Menu';

// Compoment that serves as the layout for the app. Everything will be rendered with an header and an side menu.
const Layout = () => {
  return (
    <div className="bg-gray-50 w-screen h-screen">
      <Header />
      <div className="flex p-6">
        <div className="menu">
          <Menu />
        </div>
        <div className="content w-full pl-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
