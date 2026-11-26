import { useMutation, useQuery, useQueryClient } from 'react-query';
import API from '../API';

/** O15: the OIDC client of an application (super admin). Never carries the secret. */
export interface OidcClient {
  clientId: string;
  redirectUris: string[];
  postLogoutRedirectUris: string[];
  scopes: string[];
  firstParty: boolean;
  status: 'active' | 'disabled';
  createdOn: string;
  updatedOn: string;
}

export interface CreateOidcClient {
  clientId: string;
  redirectUris: string[];
  postLogoutRedirectUris: string[];
  scopes: string[];
  firstParty: boolean;
}

/** Returned only by create and rotate: the secret is shown this once. */
export interface OidcClientSecret {
  clientId: string;
  clientSecret: string;
}

export const getOidcClient = async (applicationId: string): Promise<OidcClient | null> =>
  (await API.get(`/application/${applicationId}/oidc-client`)).data.client;

export const createOidcClient = async (
  applicationId: string,
  body: CreateOidcClient,
): Promise<OidcClientSecret> =>
  (await API.post(`/application/${applicationId}/oidc-client`, body)).data;

export const rotateOidcClientSecret = async (applicationId: string): Promise<OidcClientSecret> =>
  (await API.post(`/application/${applicationId}/oidc-client/rotate-secret`)).data;

const key = (applicationId: string) => ['oidc-client', applicationId];

export const useOidcClientQuery = (applicationId: string) =>
  useQuery(key(applicationId), () => getOidcClient(applicationId), {
    enabled: !!applicationId,
  });

export const useCreateOidcClientMutation = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation((body: CreateOidcClient) => createOidcClient(applicationId, body), {
    onSuccess: () => queryClient.invalidateQueries(key(applicationId)),
  });
};

export const useRotateOidcClientSecretMutation = (applicationId: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => rotateOidcClientSecret(applicationId), {
    onSuccess: () => queryClient.invalidateQueries(key(applicationId)),
  });
};
