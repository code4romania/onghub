import React from 'react';
import './Header.css';
import logo from './../../assets/images/logo.svg';
import profile from './../../assets/images/profile.svg';
import { useAuthContext } from '../../contexts/AuthContext';

const Header = () => {
  const { logout } = useAuthContext();

  return (
    <header className="bg-white">
      <nav className=" px-10  py-4" aria-label="Top">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center">
            <img src={logo} alt="Code 4 Romania - ONG Hub" className="h-full w-full" />
          </div>
          <div className="flex space-x-4 items-center">
            <span>Ana Popescu</span>
            <button type="button" className="save-button" onClick={() => logout()}>
              Logout
            </button>
            <img className="w-10 h-10" src={profile} alt="Profile photo" />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
