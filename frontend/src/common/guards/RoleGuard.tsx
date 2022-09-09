import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserRole } from '../../pages/users/enums/UserRole.enum';

const RoleGuard = ({ children, roles }: { children: any; roles: UserRole[] }) => {
  const { role } = useAuthContext();

  const canAccess = role && roles.includes(role);

  if (canAccess) return children;

  return <Navigate to="/" replace />;
};

export default RoleGuard;
