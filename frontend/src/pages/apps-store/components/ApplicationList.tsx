import React from 'react';
import { useAuthContext } from '../../../contexts/AuthContext';
import { UserRole } from '../../users/enums/UserRole.enum';
import ApplicationListCards from './ApplicationListCards';
import ApplicationListTable from './ApplicationListTable';

const ApplicationList = () => {
  const { role } = useAuthContext();

  return role && role == UserRole.SUPER_ADMIN ? <ApplicationListTable /> : <ApplicationListCards />;
};

export default ApplicationList;
