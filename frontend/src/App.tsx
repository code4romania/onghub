import React from 'react';
import './App.css';
import Header from './components/Header/Header';
import Menu from './components/menu/Menu';

const App = () => {
  return (
    <div className="App bg-gray-50 w-screen h-screen">
      <Header />
      <div className="p-6">
        <Menu />
      </div>
    </div>
  );
};

export default App;
