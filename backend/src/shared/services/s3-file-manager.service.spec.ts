import { S3FileManagerService } from './s3-file-manager.service';

const config = (values: Record<string, string | undefined>) =>
  ({ get: (key: string) => values[key] }) as any;

describe('S3FileManagerService region', () => {
  it('prefers AWS_REGION', async () => {
    const s3 = new S3FileManagerService(
      config({
        AWS_REGION: 'eu-central-1',
        COGNITO_REGION: 'eu-west-1',
        AWS_S3_BUCKET_NAME: 'b',
      }),
    );
    await expect(s3.getFileURL('f.png')).resolves.toBe(
      'https://b.s3.eu-central-1.amazonaws.com/f.png',
    );
  });

  it('falls back to COGNITO_REGION', async () => {
    const s3 = new S3FileManagerService(
      config({ COGNITO_REGION: 'eu-west-1', AWS_S3_BUCKET_NAME: 'b' }),
    );
    await expect(s3.getFileURL('f.png')).resolves.toBe(
      'https://b.s3.eu-west-1.amazonaws.com/f.png',
    );
  });
});
