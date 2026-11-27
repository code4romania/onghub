-- Pre-flight for own auth (plan 6.1). READ-ONLY: every statement is a SELECT.
-- Run before deploying the OwnAuthTables / UserEmailLowerUnique migrations and
-- before `auth:migrate`. Every query should return zero rows.

-- 1. Emails that differ only by case: UserEmailLowerUnique refuses to run while any exist.
SELECT lower(email) AS email, count(*) AS users, array_agg(id ORDER BY id) AS user_ids
FROM "user"
GROUP BY lower(email)
HAVING count(*) > 1;

-- 2. Emails that cannot receive a login link (very loose check: something@something.tld, no spaces).
SELECT id, email
FROM "user"
WHERE deleted_on IS NULL
  AND email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$';

-- 3. Users without an organization, other than super-admins (they cannot sign in to client apps).
SELECT id, email, role, status
FROM "user"
WHERE deleted_on IS NULL
  AND organization_id IS NULL
  AND role <> 'super-admin';

-- 4. Cognito usernames from federated logins (no such provider in own auth).
SELECT id, email, cognito_id
FROM "user"
WHERE cognito_id ILIKE 'google\_%' OR cognito_id ILIKE 'facebook\_%';
