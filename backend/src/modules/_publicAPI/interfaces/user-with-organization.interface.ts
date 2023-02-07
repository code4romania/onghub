export interface IUserWithOrganization {
  user: {
    name: string;
    email: string;
    phone: string;
    cognitoId: string;
  };
  organization: {
    name: string;
    email: string;
    phone: string;
    address: string;
    logo: string;
    description: string;
  };
}
