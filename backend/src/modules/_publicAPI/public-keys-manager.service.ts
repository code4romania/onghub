import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';
import { hapiJwt2KeyAsync } from 'jwks-rsa';
import { Repository } from 'typeorm';
import { PublicKeys } from './public-keys.entity';

@Injectable()
export class PublicKeysManager {
  private readonly logger = new Logger(PublicKeysManager.name);

  IV_LENGTH = 16;

  constructor(
    @InjectRepository(PublicKeys)
    private readonly publicKeysRepository: Repository<PublicKeys>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Will generate API and SECRET Keys to be used to call the HMAC Protected APIs
   * CAUTION: Anyone with the correct combination will be able to access the APIs.
   * Please be caution when share the secrets and always consider to delete them if are compromised.
   *
   * It will write the generated keys in DB
   * @returns
   */
  public async generateKeys(
    prefix: string = 'TRB',
    issuedBy: string,
  ): Promise<PublicKeys> {
    const API_KEY = `${prefix}.${randomBytes(16).toString('hex')}`;
    const SECRET_KEY_RAW = randomBytes(32).toString('base64');

    const keys = { API_KEY, SECRET_KEY: this.encrypt(SECRET_KEY_RAW) };

    const savedKeys = await this.publicKeysRepository.save({
      apiKey: keys.API_KEY,
      secretKey: keys.SECRET_KEY,
      issuedBy: issuedBy,
    });

    return {
      ...savedKeys,
      secretKey: SECRET_KEY_RAW,
    };
  }

  public async getSecretKey(apiKey: string) {
    const keys = await this.publicKeysRepository.findOne({
      where: { apiKey },
    });

    if (!keys?.secretKey) {
      throw Error(`Secret Key not found by API_KEY: ${apiKey}`);
    }

    return this.decrypt(keys.secretKey);
  }

  /**
   * Will encrypt the data using AES-256 by using the secret ENCRYPTION KEY and
   * will generate a unique strong random Initialization Vector to be stored along with the encrypted data
   * @param data to be encrypted
   * @returns IV : encrypted data
   */
  private encrypt(data) {
    try {
      const ENCRYPTION_KEY = this.configService.get('ENCRYPTION_KEY');
      const initializationVector = randomBytes(this.IV_LENGTH);
      const cipher = createCipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY, 'base64'),
        initializationVector,
      );
      let encrypted = cipher.update(data);

      encrypted = Buffer.concat([encrypted, cipher.final()]);

      return (
        initializationVector.toString('hex') + ':' + encrypted.toString('hex')
      );
    } catch (err) {
      this.logger.error(err);
    }
  }

  /**
   * Decrypt the data using the secret ENCRYPTION KEY and the IV from the data
   * @param data to be decrypted (format IV:encryptedData)
   * @returns decrypted data
   */
  private decrypt(data) {
    try {
      const ENCRYPTION_KEY = this.configService.get('ENCRYPTION_KEY');
      const textParts = data.split(':');
      const initializationVector = Buffer.from(textParts.shift(), 'hex');
      const encryptedText = Buffer.from(textParts.join(':'), 'hex');
      const decipher = createDecipheriv(
        'aes-256-cbc',
        Buffer.from(ENCRYPTION_KEY, 'base64'),
        initializationVector,
      );
      let decrypted = decipher.update(encryptedText);

      decrypted = Buffer.concat([decrypted, decipher.final()]);

      return decrypted.toString();
    } catch (err) {
      this.logger.error(err);
    }
  }
}
