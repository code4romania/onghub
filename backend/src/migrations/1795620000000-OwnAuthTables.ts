import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Own passwordless auth + OIDC provider storage (plan 4.1). Written from
 * scratch: VIC's OwnAuthTables has VIC-only columns (realm, status, email).
 * Nothing existing is altered; cognito_id columns stay until O16.
 */
export class OwnAuthTables1795620000000 implements MigrationInterface {
  name = 'OwnAuthTables1795620000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "auth_token_type_enum" AS ENUM ('login', 'invite', 'verify_email')`,
    );
    await queryRunner.query(
      `CREATE TYPE "auth_token_form_enum" AS ENUM ('link', 'code')`,
    );
    await queryRunner.query(
      `CREATE TYPE "auth_identity_provider_provider_enum" AS ENUM ('google')`,
    );
    await queryRunner.query(
      `CREATE TYPE "oidc_client_status_enum" AS ENUM ('active', 'disabled')`,
    );

    await queryRunner.query(`
      CREATE TABLE "auth_identity" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "user_id" integer NOT NULL,
        "email_verified_at" TIMESTAMP WITH TIME ZONE,
        "last_login_at" TIMESTAMP WITH TIME ZONE,
        "legacy_cognito_username" text,
        "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_3eeca3f18e671626194e553eb89" PRIMARY KEY ("id"),
        CONSTRAINT "REL_4f02c3f95fd60470b55ee10e2a" UNIQUE ("user_id"),
        CONSTRAINT "FK_4f02c3f95fd60470b55ee10e2a3" FOREIGN KEY ("user_id")
          REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`);

    await queryRunner.query(`
      CREATE TABLE "auth_token" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "identity_id" uuid NOT NULL,
        "type" "auth_token_type_enum" NOT NULL,
        "form" "auth_token_form_enum" NOT NULL,
        "token_hash" text NOT NULL,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "used_at" TIMESTAMP WITH TIME ZONE,
        "replaced_at" TIMESTAMP WITH TIME ZONE,
        "attempts" integer NOT NULL DEFAULT 0,
        "sent_to" text,
        "sent_by" integer,
        "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_4572ff5d1264c4a523f01aa86a0" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_bf636362c6d210728e4539630ba" UNIQUE ("token_hash"),
        CONSTRAINT "FK_39228fb204e7fde85fe8c457644" FOREIGN KEY ("identity_id")
          REFERENCES "auth_identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
        CONSTRAINT "FK_0e3e2b91a620eaf760b5077e7a1" FOREIGN KEY ("sent_by")
          REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION
      )`);
    await queryRunner.query(
      `CREATE INDEX "auth_token_live_identity_type" ON "auth_token" ("identity_id", "type") WHERE "used_at" IS NULL AND "replaced_at" IS NULL`,
    );

    await queryRunner.query(`
      CREATE TABLE "refresh_token" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "identity_id" uuid NOT NULL,
        "token_hash" text NOT NULL,
        "previous_hash" text,
        "rotated_at" TIMESTAMP WITH TIME ZONE,
        "expires_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "revoked_at" TIMESTAMP WITH TIME ZONE,
        "last_used_at" TIMESTAMP WITH TIME ZONE,
        "user_agent" text,
        "ip" text,
        "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_f0812282fad2e352cdaf83ef0a9" UNIQUE ("token_hash"),
        CONSTRAINT "FK_f42e03c38b07bb8ec60998226bd" FOREIGN KEY ("identity_id")
          REFERENCES "auth_identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`);
    await queryRunner.query(
      `CREATE INDEX "refresh_token_identity_id" ON "refresh_token" ("identity_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "refresh_token_previous_hash" ON "refresh_token" ("previous_hash")`,
    );

    await queryRunner.query(`
      CREATE TABLE "auth_identity_provider" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "identity_id" uuid NOT NULL,
        "provider" "auth_identity_provider_provider_enum" NOT NULL,
        "subject" text NOT NULL,
        "email_at_link" text,
        "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_8964a50b470c0c0d8dca794b3e4" PRIMARY KEY ("id"),
        CONSTRAINT "auth_identity_provider_provider_subject_unique" UNIQUE ("provider", "subject"),
        CONSTRAINT "FK_2712ca8fe8946a8bcc9348f1c1b" FOREIGN KEY ("identity_id")
          REFERENCES "auth_identity"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`);

    await queryRunner.query(`
      CREATE TABLE "oidc_client" (
        "id" SERIAL NOT NULL,
        "application_id" integer,
        "client_id" text NOT NULL,
        "client_secret_enc" text,
        "redirect_uris" text array NOT NULL DEFAULT '{}',
        "post_logout_redirect_uris" text array NOT NULL DEFAULT '{}',
        "allowed_scopes" text array NOT NULL DEFAULT '{openid}',
        "token_endpoint_auth_method" text NOT NULL DEFAULT 'client_secret_basic',
        "first_party" boolean NOT NULL DEFAULT false,
        "status" "oidc_client_status_enum" NOT NULL DEFAULT 'active',
        "created_by" integer,
        "updated_by" integer,
        "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cb01dc7678dfd0beb43eaa8e578" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_53e154de1d9a966edb9db77a3f5" UNIQUE ("client_id"),
        CONSTRAINT "REL_831cd058ebcc517f27a6b3c66b" UNIQUE ("application_id"),
        CONSTRAINT "FK_831cd058ebcc517f27a6b3c66b2" FOREIGN KEY ("application_id")
          REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE NO ACTION
      )`);

    await queryRunner.query(`
      CREATE TABLE "oidc_payload" (
        "kind" text NOT NULL,
        "id" text NOT NULL,
        "payload" jsonb NOT NULL,
        "grant_id" text,
        "uid" text,
        "user_code" text,
        "account_id" text,
        "expires_at" TIMESTAMP WITH TIME ZONE,
        "consumed_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_oidc_payload" PRIMARY KEY ("kind", "id")
      )`);
    await queryRunner.query(
      `CREATE INDEX "oidc_payload_grant_id" ON "oidc_payload" ("grant_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "oidc_payload_uid" ON "oidc_payload" ("uid")`,
    );
    await queryRunner.query(
      `CREATE INDEX "oidc_payload_account_id" ON "oidc_payload" ("account_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "oidc_payload_expires_at" ON "oidc_payload" ("expires_at")`,
    );

    await queryRunner.query(`
      CREATE TABLE "auth_event" (
        "id" BIGSERIAL NOT NULL,
        "type" text NOT NULL,
        "user_id" integer,
        "client_id" text,
        "reason" text,
        "ip" text,
        "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_20130748591e99a3c2e35d9a074" PRIMARY KEY ("id")
      )`);
    await queryRunner.query(
      `CREATE INDEX "auth_event_user_id" ON "auth_event" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "auth_event_created_on" ON "auth_event" ("created_on")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "auth_event"`);
    await queryRunner.query(`DROP TABLE "oidc_payload"`);
    await queryRunner.query(`DROP TABLE "oidc_client"`);
    await queryRunner.query(`DROP TABLE "auth_identity_provider"`);
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "auth_token"`);
    await queryRunner.query(`DROP TABLE "auth_identity"`);
    await queryRunner.query(`DROP TYPE "oidc_client_status_enum"`);
    await queryRunner.query(`DROP TYPE "auth_identity_provider_provider_enum"`);
    await queryRunner.query(`DROP TYPE "auth_token_form_enum"`);
    await queryRunner.query(`DROP TYPE "auth_token_type_enum"`);
  }
}
