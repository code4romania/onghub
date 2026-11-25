export interface OidcAccount {
  id: number;
  email: string;
  name: string;
  emailVerified: boolean;
}

/**
 * Returns the account only when NGO Hub allows it to sign in to client apps:
 * user ACTIVE, has an organization, organization ACTIVE (decision 5: NGO Hub is
 * SSO only, the client app decides everything else). `undefined` otherwise.
 */
/** The `organization` claim (plan 3.2), read live on every call. */
export interface OrganizationClaim {
  id: number;
  cui: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  address: string | null;
  county: { id: number; name: string } | null;
  city: { id: number; name: string } | null;
  short_description: string | null;
  website: string | null;
  logo_url: string | null;
  logo_url_expires_at: string | null;
}

export interface OidcAccountSource {
  findActive(accountId: string): Promise<OidcAccount | undefined>;
  /** Only computed when the `organization` scope was granted. */
  organizationClaim?(accountId: string): Promise<OrganizationClaim | undefined>;
}
