import { OrderDirection } from '../../common/enums/sort-direction.enum';
import { PaginatedEntity } from '../../common/interfaces/paginated-entity.interface';
import { IInvite } from '../../pages/users/interfaces/Invite.interface';

export const invitesSlice = (set: any) => ({
  invites: {
    items: [],
    meta: {
      currentPage: 1,
      itemCount: 0,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 1,
      orderByColumn: 'name',
      orderDirection: OrderDirection.ASC,
    },
  },
  setInvites: (invites: PaginatedEntity<IInvite>) => {
    set({ invites });
  },
});

export default { invitesSlice };
