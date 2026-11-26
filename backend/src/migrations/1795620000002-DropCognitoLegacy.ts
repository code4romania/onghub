import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * O16, the late step: nothing reads these since NGO Hub logs in on its own and
 * client apps use OIDC. Ship only after the production cutover (the runbook's
 * phase 4): before it, auth:migrate still needs user.cognito_id.
 *
 * down() puts the columns and the table back, empty: the Cognito ids, the old
 * client ids and the HMAC keys are gone with up().
 */
export class DropCognitoLegacy1795620000002 implements MigrationInterface {
  name = 'DropCognitoLegacy1795620000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT IF EXISTS "UQ_24f393ce6efc331a76831ffc814"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "cognito_id"`);
    await queryRunner.query(
      `ALTER TABLE "user_history" DROP COLUMN "cognito_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" DROP COLUMN "cognito_client_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_identity" DROP COLUMN "legacy_cognito_username"`,
    );
    await queryRunner.query(`DROP TABLE "public_keys"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "public_keys" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "api_key" character varying NOT NULL, "secret_key" character varying NOT NULL, "issued_by" character varying NOT NULL, CONSTRAINT "PK_35191e079da7902972477d26c77" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_314d1dffdf6d12a86f7aca7051" ON "public_keys" ("created_on")`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_identity" ADD "legacy_cognito_username" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "application" ADD "cognito_client_id" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_history" ADD "cognito_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "cognito_id" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_24f393ce6efc331a76831ffc814" UNIQUE ("cognito_id")`,
    );
  }
}
