import { SunIcon, UserGroupIcon } from '@heroicons/react/outline';
import React from 'react';
import StatisticsCard from '../../components/statistics-card/StatisticsCard';

const Dashboard = () => {
  return <div>
    <StatisticsCard stat={{icon: UserGroupIcon, title: 'Numarul de', count: 10, movementInTheLastMonth: -12}}/>
  </div>;
};

export default Dashboard;
