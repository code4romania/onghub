import { Organization } from 'src/modules/organization/entities';
import { Pagination } from '../interfaces/pagination';

export const flattenPullingTypeEntity = <
  T extends { organization?: Organization },
>(
  organizations: Pagination<T>,
): Pagination<
  T & {
    organizationName: string;
    organizationId: number;
    logo: string;
  }
> => {
  const { items, meta } = organizations;

  const flatItems = items.reduce((previous, current) => {
    const { organization, ...entity } = current;
    previous.push({
      ...entity,
      organizationId: organization?.id,
      organizationName: organization?.organizationGeneral?.name,
      logo: organization?.organizationGeneral?.logo,
    });
    return previous;
  }, []);

  return {
    items: flatItems,
    meta,
  };
};
