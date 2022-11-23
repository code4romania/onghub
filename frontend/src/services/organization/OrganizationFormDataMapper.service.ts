import { cleanupPayload } from '../../common/helpers/format.helper';
import { Person } from '../../common/interfaces/person.interface';
import {
  ICreateOrganizationActivity,
  ICreateOrganizationGeneral,
  ICreateOrganizationLegal,
  ICreateOrganizationUser,
} from '../../pages/create-organziation/interfaces/CreateOrganization.interface';
import { Contact } from '../../pages/organization/interfaces/Contact.interface';
import { Expense } from '../../pages/organization/interfaces/Expense.interface';
import { Income } from '../../pages/organization/interfaces/Income.interface';

export const mapAdminToFormData = (payload: FormData, admin: ICreateOrganizationUser): FormData => {
  return mapEntityToFormData(payload, 'admin', admin);
};

export const mapOrganizationGeneralToFormDara = (
  payload: FormData,
  general: ICreateOrganizationGeneral,
  organizationGeneralKey: string,
): FormData => {
  const { contact, city, county, ...organizationGeneral } = general;

  // map basic organization general fields
  const organizationGeneralPayload = mapEntityToFormData(
    payload,
    organizationGeneralKey,
    organizationGeneral,
  );

  // mapt county id and city id
  organizationGeneralPayload.append(`${organizationGeneralKey}[countyId]`, county?.id.toString());
  organizationGeneralPayload.append(`${organizationGeneralKey}[cityId]`, city?.id.toString());

  // map contact
  const organizationWithContactPayload = mapEntityToFormData(
    organizationGeneralPayload,
    `${organizationGeneralKey}[contact]`,
    contact,
  );

  return organizationWithContactPayload;
};

export const mapOrganizationActivityToFormData = (
  payload: FormData,
  activity: ICreateOrganizationActivity,
  organizationActivityKey: string,
): FormData => {
  const { domains, federations, coalitions, branches, cities, regions, ...organizationActivity } =
    activity;

  // map all arays first
  branches?.forEach((branch: number) => {
    payload.append(`${organizationActivityKey}[branches][]`, branch.toString());
  });

  cities?.forEach((city: number) => {
    payload.append(`${organizationActivityKey}[cities][]`, city.toString());
  });

  coalitions?.forEach((coalition: number) => {
    payload.append(`${organizationActivityKey}[coalitions][]`, coalition.toString());
  });

  federations?.forEach((federation: number) => {
    payload.append(`${organizationActivityKey}[federations][]`, federation.toString());
  });

  regions?.forEach((region: number) => {
    payload.append(`${organizationActivityKey}[regions][]`, region.toString());
  });

  domains?.forEach((domain: number) => {
    payload.append(`${organizationActivityKey}[domains][]`, domain.toString());
  });

  return mapEntityToFormData(payload, organizationActivityKey, organizationActivity);
};

export const mapOrganizationLegalToFormData = (
  payload: FormData,
  legal: ICreateOrganizationLegal,
  organizationLegalKey: string,
) => {
  const { directors, legalReprezentative, others } = legal;

  let organizationLegalUpdated = mapEntityToFormData(
    payload,
    `${organizationLegalKey}[legalReprezentative]`,
    legalReprezentative,
  );

  directors.forEach((director: Contact, index: number) => {
    organizationLegalUpdated = mapEntityToFormData(
      organizationLegalUpdated,
      `${organizationLegalKey}[directors][${index}]`,
      director,
    );
  });

  others?.forEach((other: Person, index: number) => {
    organizationLegalUpdated = mapEntityToFormData(
      organizationLegalUpdated,
      `${organizationLegalKey}[others][${index}]`,
      other,
    );
  });

  return organizationLegalUpdated;
};

export const mapOrganizationFinancialToFormData = (
  payload: FormData,
  legal: {
    id: number;
    data: Partial<Income | Expense>;
  },
  organizationLegalKey: string,
) => {
  const { data, id } = legal;

  payload.append(`${organizationLegalKey}[id]`, id.toString());
  const payloadWithExpenseIncome = mapEntityToFormData(
    payload,
    `${organizationLegalKey}[data]`,
    data,
  );

  return payloadWithExpenseIncome;
};

export const mapEntityToFormData = (
  payload: FormData,
  formdDataKey: string,
  data: any,
): FormData => {
  for (const prop in cleanupPayload(data)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.append(`${formdDataKey}[${prop}]`, (data as any)[prop] as string);
  }
  return payload;
};
