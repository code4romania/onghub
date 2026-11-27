import { FILE_URL_EXPIRATION_TIME } from 'src/shared/constants/file.constants';
import { UserAccountSource } from './user-account.source';

// The `organization` claim (O12): the logo is a presigned URL with its expiry, read live.
describe('UserAccountSource.organizationClaim', () => {
  const general = {
    cui: 'RO12345678',
    name: 'Asociatia',
    email: 'contact@ong.ro',
    phone: '+40700000000',
    address: 'Str. 1',
    county: { id: 1, name: 'Cluj' },
    city: { id: 2, name: 'Cluj-Napoca' },
    shortDescription: 'scurt',
    website: 'https://ong.ro',
    logo: 'organizations/7/logo.png',
  };
  const user = (logo: string | null) => ({
    id: 5,
    role: 'admin',
    organization: { id: 7, organizationGeneral: { ...general, logo } },
  });

  const source = (found: unknown, presign = jest.fn()) =>
    new UserAccountSource(
      { findOne: jest.fn().mockResolvedValue(found) } as any,
      {} as any,
      { generatePresignedURL: presign } as any,
    );

  it('presigns the logo and says until when the URL works', async () => {
    const presign = jest
      .fn()
      .mockResolvedValue('https://bucket.s3/logo.png?X-Amz-Signature=x');
    const before = Date.now();
    const claim = await source(user(general.logo), presign).organizationClaim(
      '5',
    );

    expect(presign).toHaveBeenCalledWith('organizations/7/logo.png');
    expect(claim.logo_url).toBe('https://bucket.s3/logo.png?X-Amz-Signature=x');
    const expires = new Date(claim.logo_url_expires_at).getTime();
    expect(expires).toBeGreaterThanOrEqual(
      before + FILE_URL_EXPIRATION_TIME * 1000,
    );
    expect(expires).toBeLessThanOrEqual(
      Date.now() + FILE_URL_EXPIRATION_TIME * 1000,
    );
  });

  it('no logo: no URL, no expiry, nothing presigned', async () => {
    const presign = jest.fn();
    const claim = await source(user(null), presign).organizationClaim('5');
    expect(claim).toMatchObject({
      id: 7,
      cui: 'RO12345678',
      role: 'admin',
      logo_url: null,
      logo_url_expires_at: null,
    });
    expect(presign).not.toHaveBeenCalled();
  });

  it('refuses an account id that is not a positive integer without a lookup', async () => {
    const lookup = source(user(null));
    expect(await lookup.organizationClaim('0')).toBeUndefined();
    expect(await lookup.organizationClaim('5 OR 1=1')).toBeUndefined();
  });
});
