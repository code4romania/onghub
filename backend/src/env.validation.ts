import { plainToClass } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  validateSync,
  IsString,
  IsOptional,
  IsNumberString,
} from 'class-validator';

export enum Environment {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsOptional()
  DATABASE_URL: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  DATABASE_HOST: string;

  @IsNumber()
  THROTTLE_TTL: number;

  @IsNumber()
  THROTTLE_LIMIT: number;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsNumber()
  CACHE_TTL: number;

  @IsString()
  COGNITO_USER_POOL_ID: string;
  @IsString()
  COGNITO_CLIENT_ID: string;
  @IsString()
  COGNITO_REGION: string;

  @IsString()
  AWS_ACCESS_KEY_ID: string;
  @IsString()
  AWS_SECRET_ACCESS_KEY: string;
  @IsString()
  AWS_S3_BUCKET_NAME: string;
  @IsOptional()
  @IsString()
  AWS_REGION?: string;

  @IsOptional()
  @IsNumberString()
  TRUST_PROXY_HOPS?: string;

  @IsOptional()
  @IsString()
  BULL_PREFIX?: string;

  @IsOptional()
  @IsString()
  TYPEORM_MIGRATIONS_RUN?: string;

  // Own auth (O5). All optional until the cutover; see AuthConfigService.enabled.
  @IsOptional()
  @IsString()
  JWT_PRIVATE_KEY?: string;
  @IsOptional()
  @IsString()
  JWT_PUBLIC_KEY?: string;
  @IsOptional()
  @IsString()
  JWT_KEY_ID?: string;
  @IsOptional()
  @IsNumberString()
  JWT_ACCESS_TTL_SECONDS?: string;
  @IsOptional()
  @IsNumberString()
  REFRESH_TTL_DAYS_WEB?: string;

  @IsOptional()
  @IsNumberString()
  SUPER_ADMIN_SESSION_HOURS?: string;
  @IsOptional()
  @IsString()
  AUTH_TOKEN_KEY?: string;
  @IsOptional()
  @IsString()
  WEB_APP_URL?: string;
  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;
  @IsOptional()
  @IsString()
  REDIS_KEY_PREFIX?: string;
  @IsOptional()
  @IsString()
  MAIL_ALLOWLIST?: string;
  @IsOptional()
  @IsString()
  AUTH_TOKEN_KEY_PREVIOUS?: string;
  @IsOptional()
  @IsString()
  OIDC_ALLOW_LOCALHOST_REDIRECTS?: string;

  @IsString()
  MAIL_HOST;
  @IsNumberString()
  MAIL_PORT;
  @IsString()
  MAIL_USER;
  @IsString()
  MAIL_PASS;
  @IsString()
  MAIL_FROM: string;
  @IsString()
  MAIL_CONTACT: string;

  @IsString()
  AWS_S3_BUCKET_NAME_PUBLIC: string;

  @IsString()
  ONGHUB_URL: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
