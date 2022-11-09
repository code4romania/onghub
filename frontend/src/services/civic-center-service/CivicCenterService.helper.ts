import { formatISO9075 } from 'date-fns';
import { CivicCenterServicePayload } from './interfaces/civic-center-service-payload.interface';

export const parseCivicServiceFormDataToPaylod = (
  data: CivicCenterServicePayload | Partial<CivicCenterServicePayload>,
) => {
  // parse data
  const {
    hasPhysicalAccess,
    hasOnlineAccess,
    hasEmailPhoneAccess,
    location,
    isPeriodNotDetermined,
    startDate,
    endDate,
    ...civicCenterServicePaylod
  } = data;

  // format dates
  const formatedStartDate = startDate ? formatISO9075(startDate as Date) : startDate;

  let formatedEndDate = null;
  if (!isPeriodNotDetermined) {
    formatedEndDate = endDate ? formatISO9075(endDate as Date) : endDate;
  }

  return {
    ...civicCenterServicePaylod,
    isPeriodNotDetermined: !!isPeriodNotDetermined,
    startDate: formatedStartDate,
    hasPhysicalAccess: !!hasPhysicalAccess,
    hasOnlineAccess: !!hasOnlineAccess,
    hasEmailPhoneAccess: !!hasEmailPhoneAccess,
    endDate: formatedEndDate,
    locationId: (location as { value: number; label: string })?.value,
  };
};
