import { MigrationInterface, QueryRunner } from 'typeorm';

export class Beneficiaries1716549264192 implements MigrationInterface {
  name = 'Beneficiaries1716549264192';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "_beneficiary" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_680ec92b80a3a9a5ff18f0630b4" PRIMARY KEY ("id"))`,
    );
    // Insert the values
    await queryRunner.query(`
            INSERT INTO "_beneficiary" (name) VALUES
            ('copii (0-14 ani)'),
            ('tineri (15-18 ani)'),
            ('adulți (18-25 ani)'),
            ('vârstnici (>65 ani)'),
            ('familie'),
            ('persoane aflate în risc de sărăcie'),
            ('persoane cu adicţii (alcool, droguri, jocuri de noroc etc.)'),
            ('persoane cu afecţiuni medicale'),
            ('persoane cu afecţiuni psihice'),
            ('persoane cu dizabilităţi'),
            ('persoane din comunităţi izolate'),
            ('persoane fără adăpost'),
            ('persoane private de libertate'),
            ('victime ale traficului de persoane'),
            ('victime ale violenţei domestice'),
            ('şomeri de lungă durată'),
            ('servicii sociale de suport pentru aparţinătorii beneficiarilor')
        `);
    await queryRunner.query(
      `CREATE TABLE "civic_center_service_to_beneficiary" ("civic_center_service_id" integer NOT NULL, "beneficiary_id" integer NOT NULL, CONSTRAINT "PK_1ec14ffa726e31df630f5a47367" PRIMARY KEY ("civic_center_service_id", "beneficiary_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ce738baa15588686511310b7b" ON "civic_center_service_to_beneficiary" ("civic_center_service_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3d4def4c6507c1dfa407066477" ON "civic_center_service_to_beneficiary" ("beneficiary_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" DROP COLUMN "age_categories"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."civic_center_service_age_categories_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service_to_beneficiary" ADD CONSTRAINT "FK_6ce738baa15588686511310b7b3" FOREIGN KEY ("civic_center_service_id") REFERENCES "civic_center_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service_to_beneficiary" ADD CONSTRAINT "FK_3d4def4c6507c1dfa4070664777" FOREIGN KEY ("beneficiary_id") REFERENCES "_domain"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "civic_center_service_to_beneficiary" DROP CONSTRAINT "FK_3d4def4c6507c1dfa4070664777"`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service_to_beneficiary" DROP CONSTRAINT "FK_6ce738baa15588686511310b7b3"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."civic_center_service_age_categories_enum" AS ENUM('COPII', 'TINERI', 'ADULTI', 'VARSTNICI', 'FAMILIE', 'RISC_DE_SARACIE', 'ADICTII', 'AFECTIUNI_MEDICALE', 'AFECTIUNI_PSIHICE', 'DIZABILITATI', 'COMUNITATI_IZOLATE', 'FARA_ADAPOST', 'PRIVATE_DE_LIBERTATE', 'TRAFICULUI_DE_PERSOANE', 'VIOLENTEI_DOMESTICE', 'SOMERI', 'APARTINATORII_BENEFICIARILOR')`,
    );
    await queryRunner.query(
      `ALTER TABLE "civic_center_service" ADD "age_categories" "public"."civic_center_service_age_categories_enum" array NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3d4def4c6507c1dfa407066477"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6ce738baa15588686511310b7b"`,
    );
    await queryRunner.query(`DROP TABLE "civic_center_service_to_beneficiary"`);
    await queryRunner.query(`DROP TABLE "_beneficiary"`);
  }
}
