import { IInvite } from '../../pages/users/interfaces/Invite.interface';

export const invitesSlice = (set: any) => ({
  invites: [],
  setInvites: (invites: IInvite[]) => {
    set({ invites });
  },
});

export default { invitesSlice };
