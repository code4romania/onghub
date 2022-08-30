export const OrganizationCompletionStatusOptions = [
  {
    status: 1,
    label: 'Incomplet',
  },
  {
    status: 0,
    label: 'Actualizat',
  },
];

export const OrganizationsUsersCountOptions = [
  {
    label: '0-100',
    status: '$btw:0,100',
  },
  {
    label: '100-300',
    status: '$btw:100,300',
  },
  {
    label: '300+',
    status: '$gte:300',
  },
];
