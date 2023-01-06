import { CreateOrganizationError } from './entities/create-organization-errors.class';

// Here we list all the group of errors for every page
export class InternalErrors {
  public static createOrganizationErrors = new CreateOrganizationError();
}
