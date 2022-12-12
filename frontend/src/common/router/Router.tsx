import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
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
import OrganizationOverview from '../../pages/organization/components/Overview/OrganizationOverview';
import CreatePracticeProgram from '../../pages/pactice-program/CreatePracticeProgram';
import EditPracticeProgram from '../../pages/pactice-program/EditPracticeProgram';
import PracticePrograms from '../../pages/pactice-program/PracticePrograms';
import CreateCivicCenterService from '../../pages/civic-center-service/CreateCivicCenterService';
import FeedbackList from '../../pages/civic-center-service/feedback/FeedbackList';
import EditCivicCenterService from '../../pages/civic-center-service/EditCivicCenterService';
import CivicCenterWrapper from '../../pages/civic-center-service/CivicCenterWrapper';
import CivicCenterServiceList from '../../pages/civic-center-service/CivicCenterServiceList';
import OrganizationPracticePrograms from '../../pages/organization/components/OrganizationPracticePrograms/OrganizationPracticePrograms';
import OrganizationServices from '../../pages/organization/components/OrganizationServices/OrganizationServices';

const Router = () => {
  const { isAuthenticated, isRestricted, role } = useAuthContext();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public URLs */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to={'/'} replace={true}></Navigate>}
        />

        <Route path="new" element={<CreateOrganization />}>
          <Route index element={<Navigate to={'/new/account'} replace={true}></Navigate>} />
          <Route path="account" element={<CreateOrganizationUser />} />
          <Route path="general" element={<CreateOrganizationGeneral />} />
          <Route path="activity" element={<CreateOrganizationActivity />} />
          <Route path="legal" element={<CreateOrganizationLegal />} />
        </Route>
        {/* End of Public URLS */}

        {/* Logged in users but Restricted */}
        <Route path="/restricted" element={!isRestricted ? <Navigate to={'/'} replace={true}></Navigate> : <RestrictedAccount />} />

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
            path="all-apps"
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN, UserRole.ADMIN]}>
                <AllApplications />
              </RoleGuard>
            }
          >
            <Route index element={<Navigate to={'overview'} replace={true}></Navigate>} />
            <Route path="overview" element={<ApplicationList />} />
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
            <Route index element={<Navigate to={'list'} replace={true}></Navigate>} />
            <Route path="list" element={<UserList />}></Route>
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
            <Route index element={<Navigate to={'general'} replace={true}></Navigate>} />
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
          {role === UserRole.SUPER_ADMIN ? (
            <Route index element={<SuperAdminDashboard />}></Route>
          ) : (
            <Route index element={<Dashboard />}></Route>
          )}

          <Route
            path={'organizations/:id'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <Organization />
              </RoleGuard>
            }
          >
            <Route index element={<Navigate to={'overview'} replace={true}></Navigate>} />
            <Route path="overview" element={<OrganizationOverview />} />
            <Route path="general" element={<OrganizationGeneral />} />
            <Route path="activity" element={<OrganizationActivity />} />
            <Route path="legal" element={<OrganizationLegal />} />
            <Route path="financial" element={<OrganizationFinancial />} />
            <Route path="data" element={<OrganizationData />} />
            <Route path="applications" element={<OrganizationApplications />} />
            <Route path="programs" element={<OrganizationPracticePrograms />} />
            <Route path="services" element={<OrganizationServices />} />
          </Route>
          <Route
            path={'organization'}
            element={
              <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                <OrganizationProfile />
              </RoleGuard>
            }
          >
            <Route index element={<Navigate to={'general'} replace={true}></Navigate>} />
            <Route path="general" element={<OrganizationGeneral />} />
            <Route path="activity" element={<OrganizationActivity />} />
            <Route path="legal" element={<OrganizationLegal />} />
            <Route path="financial" element={<OrganizationFinancial />} />
            <Route path="data" element={<OrganizationData />} />
          </Route>

          <Route
            path={'organizations/:organizationId/programs/add'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <CreatePracticeProgram />
              </RoleGuard>
            }
          ></Route>

          <Route
            path={'organizations/:organizationId/programs/:id'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <EditPracticeProgram />
              </RoleGuard>
            }
          ></Route>

          <Route
            path={'organizations/:organizationId/services/add'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <CreateCivicCenterService />
              </RoleGuard>
            }
          ></Route>

          <Route
            path={'organizations/:organizationId/services/:id'}
            element={
              <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                <EditCivicCenterService />
              </RoleGuard>
            }
          ></Route>

          {role === UserRole.SUPER_ADMIN ? (
            <Route
              path={'application/:id'}
              element={
                <RoleGuard roles={[UserRole.SUPER_ADMIN]}>
                  <ApplicationWithOngList />
                </RoleGuard>
              }
            >
              <Route index element={<Navigate to={'details'} replace={true}></Navigate>} />
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
              <Route index element={<Navigate to={'details'} replace={true}></Navigate>} />
              <Route path="details" element={<ApplicationDetails />} />
            </Route>
          )}

          {/* Practice programs */}
          <Route
            path={'practice-program'}
            element={
              <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                <Outlet />
              </RoleGuard>
            }
          >
            <Route index element={<PracticePrograms />} />
            <Route path="add" element={<CreatePracticeProgram />} />
            <Route path=":id" element={<EditPracticeProgram />} />
          </Route>

          {/* Civic Service */}
          <Route
            path={'service'}
            element={
              <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                <CivicCenterWrapper />
              </RoleGuard>
            }
          >
            <Route index element={<CivicCenterServiceList />} />
            <Route path="feedback" element={<FeedbackList />} />
          </Route>

          <Route
            path="service/add"
            element={
              <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                <CreateCivicCenterService />
              </RoleGuard>
            }
          />
          <Route
            path="service/:id"
            element={
              <RoleGuard roles={[UserRole.ADMIN, UserRole.EMPLOYEE]}>
                <EditCivicCenterService />
              </RoleGuard>
            }
          />

          <Route path="account" element={<Account />} />
        </Route>

        {/* Wild Card */}
        <Route path="*" element={<Navigate to={'/'} replace={true}></Navigate>}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
