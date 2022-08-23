import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../containers/Layout';
import { useAuthContext } from '../../contexts/AuthContext';
import Account from '../../pages/account/Account';
import AppStore from '../../pages/apps-store/AppStore';
import CreateOrganizationActivity from '../../pages/create-organziation/components/CreateOrganizationActivity';
import CreateOrganizationGeneral from '../../pages/create-organziation/components/CreateOrganizationGeneral';
import CreateOrganizationLegal from '../../pages/create-organziation/components/CreateOrganizationLegal';
import CreateOrganizationUser from '../../pages/create-organziation/components/CreateOrganizationUser';
import CreateOrganization from '../../pages/create-organziation/CreateOrganization';
import Dashboard from '../../pages/dashboard/Dashboard';
import Login from '../../pages/login/Login';
import Apps from '../../pages/my-apps/Apps';
import OrganizationActivity from '../../pages/organization/components/OrganizationActivity/OrganizationActivity';
import OrganizationData from '../../pages/organization/components/OrganizationData/OrganizationData';
import OrganizationFinancial from '../../pages/organization/components/OrganizationFinancial/OrganizationFinancial';
import OrganizationGeneral from '../../pages/organization/components/OrganizationGeneral/OrganizationGeneral';
import OrganizationLegal from '../../pages/organization/components/OrganizationLegal/OrganizationLegal';
import Organization from '../../pages/organization/Organization';
import Requests from '../../pages/requests/Requests';
import Request from '../../pages/requests//components/Request';
import UserCreate from '../../pages/users/components/UserCreate/UserCreate';
import UserEdit from '../../pages/users/components/UserEdit/UserEdit';
import UserInvites from '../../pages/users/components/UserInvites/UserInvites';
import UserList from '../../pages/users/components/UserList/UserList';
import Users from '../../pages/users/Users';
import AuthGuard from '../guards/AuthGuards';
import AddApplication from '../../pages/apps-store/components/AddApplication';

const Router = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={'/'}></Navigate>}
        />
        <Route path="new" element={<CreateOrganization />}>
          <Route index element={<Navigate to={'/new/account'}></Navigate>} />
          <Route path="account" element={<CreateOrganizationUser />} />
          <Route path="general" element={<CreateOrganizationGeneral />} />
          <Route path="activity" element={<CreateOrganizationActivity />} />
          <Route path="legal" element={<CreateOrganizationLegal />} />
        </Route>
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          <Route index element={<Dashboard />}></Route>
          <Route path={'organization'} element={<Organization />}>
            <Route index element={<Navigate to={'general'}></Navigate>} />
            <Route path="general" element={<OrganizationGeneral />} />
            <Route path="activity" element={<OrganizationActivity />} />
            <Route path="legal" element={<OrganizationLegal />} />
            <Route path="financial" element={<OrganizationFinancial />} />
            <Route path="data" element={<OrganizationData />} />
          </Route>

          <Route path={'requests/:id'} element={<Request />}>
            <Route index element={<Navigate to={'general'}></Navigate>} />
            <Route path="general" element={<OrganizationGeneral />} />
            <Route path="activity" element={<OrganizationActivity />} />
            <Route path="legal" element={<OrganizationLegal />} />
            <Route path="financial" element={<OrganizationFinancial />} />
            <Route path="data" element={<OrganizationData />} />
          </Route>

          <Route path="users" element={<Users />}>
            <Route index element={<UserList />}></Route>
            <Route path="invites" element={<UserInvites />}></Route>
          </Route>

          <Route path="user" element={<UserCreate />} />
          <Route path="user/:id" element={<UserEdit />} />
          <Route path="apps" element={<Apps />}></Route>
          <Route path="store" element={<AppStore />}></Route>
          <Route path="store/new" element={<AddApplication />} />
          <Route path="account" element={<Account />} />
          <Route path="requests" element={<Requests />} />
        </Route>
        <Route path="*" element={<Navigate to={'/'}></Navigate>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
