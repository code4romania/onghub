import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../../containers/Layout';
import { useAuthContext } from '../../contexts/AuthContext';
import Account from '../../pages/account/Account';
import AllApplications from '../../pages/apps-store/AllApplications';
import CreateOrganizationActivity from '../../pages/create-organziation/components/CreateOrganizationActivity';
import CreateOrganizationGeneral from '../../pages/create-organziation/components/CreateOrganizationGeneral';
import CreateOrganizationLegal from '../../pages/create-organziation/components/CreateOrganizationLegal';
import CreateOrganizationUser from '../../pages/create-organziation/components/CreateOrganizationUser';
import CreateOrganization from '../../pages/create-organziation/CreateOrganization';
import Dashboard from '../../pages/dashboard/Dashboard';
import Login from '../../pages/login/Login';
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
import Organizations from '../../pages/organization/Organizations';
import AddApplication from '../../pages/apps-store/components/AddApplication';
import Application from '../../pages/application/Application';
import ApplicationDetails from '../../pages/application/components/ApplicationDetails';
import ApplicationNGOList from '../../pages/application/components/ApplicationNGOList';
import RestrictedAccount from '../../pages/restricted-account/RestrictedAccount';
import MyApps from '../../pages/my-apps/MyApps';
import ApplicationList from '../../pages/apps-store/components/ApplicationList';
import ApplicationRequests from '../../pages/apps-store/components/ApplicationRequests';
import RoleGuard from '../guards/RoleGuard';
import { UserRole } from '../../pages/users/enums/UserRole.enum';
import EditApplication from '../../pages/apps-store/components/EditApplication';
import ApplicationWithOngList from '../../pages/application/ApplicationWithOngList';
import OrganizationProfile from '../../pages/organization/OrganizationProfile';
import OrganizationApplications from '../../pages/organization/components/OrganizationApplications/OrganizationApplications';
import SuperAdminDashboard from '../../pages/dashboard/SuperAdminDashboard';

const Router = () => {
  const { isAuthenticated, isRestricted, role } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public URLs */}
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
        {/* End of Public URLS */}

        {/* Logged in users but Restricted */}
        <Route path="/restricted" element={!isRestricted ? <Login /> : <RestrictedAccount />} />

        {/* Logged in Users */}
        <Route
          path="/"
          element={
            <AuthGuard>
              <Layout />
            </AuthGuard>
          }
        >
          {/* Admin and Employee */}
          <Route
            path="apps"
            element={
              <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                <MyApps />
              </RoleGuard>
            }
          ></Route>

          {/* Admin only */}
          <Route
            path="user"
            element={
              <RoleGuard roles={[UserRole.ADMIN]}>
                <UserCreate />
              </RoleGuard>
            }
          />
          <Route
            path="user/:id"
            element={
              <RoleGuard roles={[UserRole.ADMIN]}>
                <UserEdit />
              </RoleGuard>
            }
          />

          {/* SuperAdmin and Admin */}
          <Route
            path={'all-apps'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <AllApplications />
              </RoleGuard>
            }
          >
            <Route index element={<ApplicationList />} />
            <Route
              path="requests"
              element={
                // Special Route just for SuperAdmin
                <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                  <ApplicationRequests />
                </RoleGuard>
              }
            />
          </Route>

          <Route
            path="users"
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <Users />
              </RoleGuard>
            }
          >
            <Route index element={<UserList />}></Route>
            <Route path="invites" element={<UserInvites />}></Route>
          </Route>

          {/* SuperAdmin Only */}
          <Route
            path="requests"
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <Requests />
              </RoleGuard>
            }
          />
          <Route
            path={'requests/:id'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <Request />
              </RoleGuard>
            }
          >
            <Route index element={<Navigate to={'general'}></Navigate>} />
            <Route path="general" element={<OrganizationGeneral />} />
            <Route path="activity" element={<OrganizationActivity />} />
            <Route path="legal" element={<OrganizationLegal />} />
            <Route path="financial" element={<OrganizationFinancial />} />
            <Route path="data" element={<OrganizationData />} />
          </Route>
          <Route
            path="organizations"
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <Organizations />
              </RoleGuard>
            }
          />

          <Route
            path="organizations/:id"
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <Organizations />
              </RoleGuard>
            }
          />
          <Route
            path="all-apps/new"
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <AddApplication />
              </RoleGuard>
            }
          />
          <Route
            path="application/:id/edit"
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <EditApplication />
              </RoleGuard>
            }
          />

          {/* Admin and Employee */}
          <Route index element={role === UserRole.SUPER_ADMIN ? <SuperAdminDashboard/> : <Dashboard />}></Route>

          <Route
            path={'organizations/:id'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <Organization />
              </RoleGuard>
            }
          >
            <Route index element={<Navigate to={'overview'}></Navigate>} />
            <Route path="overview" element={<div>Overview</div>} />
            <Route path="general" element={<OrganizationGeneral />} />
            <Route path="activity" element={<OrganizationActivity />} />
            <Route path="legal" element={<OrganizationLegal />} />
            <Route path="financial" element={<OrganizationFinancial />} />
            <Route path="data" element={<OrganizationData />} />
            <Route path="applications" element={<OrganizationApplications />} />
          </Route>
          <Route
            path={'organization'}
            element={
              <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                <OrganizationProfile />
              </RoleGuard>
            }
          >
            <Route index element={<Navigate to={'general'}></Navigate>} />
            <Route path="general" element={<OrganizationGeneral />} />
            <Route path="activity" element={<OrganizationActivity />} />
            <Route path="legal" element={<OrganizationLegal />} />
            <Route path="financial" element={<OrganizationFinancial />} />
            <Route path="data" element={<OrganizationData />} />
          </Route>

          {role === UserRole.SUPER_ADMIN ? (
            <Route
              path={'application/:id'}
              element={
                <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                  <ApplicationWithOngList />
                </RoleGuard>
              }
            >
              <Route index element={<Navigate to={'details'}></Navigate>} />
              <Route path="details" element={<ApplicationDetails />} />
              <Route path="installs" element={<ApplicationNGOList />} />
            </Route>
          ) : (
            <Route
              path={'application/:id'}
              element={
                <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                  <Application />
                </RoleGuard>
              }
            >
              <Route index element={<Navigate to={'details'}></Navigate>} />
              <Route path="details" element={<ApplicationDetails />} />
            </Route>
          )}
          <Route path="account" element={<Account />} />
        </Route>

        {/* Wild Card */}
        <Route path="*" element={<Navigate to={'/'}></Navigate>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
