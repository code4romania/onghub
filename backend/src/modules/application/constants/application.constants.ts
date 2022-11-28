// Postgres needs double quotes for alis in order to convert to camelcase otherwise it will automatically convert it to lowercase
export const ORGANIZATION_ALL_APPS_COLUMNS = [
  'application.id as id',
  'application.logo as logo',
  'application.name as name',
  'application.short_description as "shortDescription"',
  'application.login_link as "loginLink"',
  'application.website as website',
  'application.status as status',
  'ongApp.status as "ongStatus"',
  'ongApp.created_on as "createdOn"',
  'application.type as type',
];

export const APPLICATIONS_FILES_DIR = 'applications';
