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
export interface OidcAccountSource {
  findActive(accountId: string): Promise<OidcAccount | undefined>;
}
