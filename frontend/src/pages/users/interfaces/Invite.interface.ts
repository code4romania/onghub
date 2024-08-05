export interface IInvite {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdOn: Date;
  role: string;
  organization: { id: number; organizationGeneral: { alias: string } };
}
