import { MigrationInterface, QueryRunner } from "typeorm";

export class DDLMigration1648760400000 implements MigrationInterface {
    name = 'DDLMigration1648760400000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public_keys" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "api_key" character varying NOT NULL, "secret_key" character varying NOT NULL, "issued_by" character varying NOT NULL, CONSTRAINT "PK_35191e079da7902972477d26c77" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_314d1dffdf6d12a86f7aca7051" ON "public_keys" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_contact" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "full_name" text NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, CONSTRAINT "PK_202d26fdc2339e622e96458a39d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ab34bcec3d684f98a87118e5bf" ON "_contact" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_region" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_9e68ee1d547955257ed65bd4ca9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2aeafa6b84ba955e8a46027875" ON "_region" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_county" ("id" integer NOT NULL, "name" text NOT NULL, "abbreviation" text NOT NULL, "region_id" integer, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_8ed2f9c8ce877360cd353f8d099" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_806f2632bf2d7cbf69b408fb02" ON "_county" ("region_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_8364fa95839cb74d16072d5654" ON "_county" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_domain" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_7eb250d514b0e17619fa7ff922e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1065d39d4b99a1110ac1d3da65" ON "_domain" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_federation" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "abbreviation" text NOT NULL, CONSTRAINT "PK_247066e22a4e592438494c7da48" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c6e49847ab2f983f34252df395" ON "_federation" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_coalition" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "abbreviation" text NOT NULL, CONSTRAINT "PK_ef3cc0c991b60b77f67b12160b2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_dfacea4bae7c2a3ff281a5726b" ON "_coalition" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_faculty" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_08c1a3e4dc42856ec0b2e38b072" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_01403be9727760dfb75d42ed29" ON "_faculty" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_skill" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, CONSTRAINT "PK_861bedf4e3897a22d923926def7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d14a623c137986a8e9948edd5c" ON "_skill" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "feedback" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "full_name" character varying NOT NULL, "interaction_date" character varying NOT NULL, "message" character varying NOT NULL, "rating" integer NOT NULL, "civic_center_service_id" integer NOT NULL, CONSTRAINT "PK_8389f9e087a57689cd5be8b2b13" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9d454fcad2648e52f56dcfc203" ON "feedback" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."civic_center_service_age_categories_enum" AS ENUM('0-18', '18-25', '25-35', '35-60', '60+')`);
        await queryRunner.query(`CREATE TABLE "civic_center_service" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "location_id" integer, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE, "is_period_not_determined" boolean NOT NULL DEFAULT false, "short_description" character varying NOT NULL, "long_description" character varying NOT NULL, "age_categories" "public"."civic_center_service_age_categories_enum" array NOT NULL, "has_online_access" boolean NOT NULL DEFAULT false, "online_access_link" character varying, "online_access_description" character varying, "has_email_phone_access" boolean NOT NULL DEFAULT false, "email_access" character varying, "phone_access" character varying, "email_phone_access_description" character varying, "has_physical_access" boolean NOT NULL DEFAULT false, "physical_access_address" character varying, "physical_access_description" character varying, "active" boolean NOT NULL DEFAULT true, "organization_id" integer NOT NULL, CONSTRAINT "PK_d38afda83145bafba8c8c0c6ac1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_76a0d33c0d0d9854d477054148" ON "civic_center_service" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "practice_program" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "title" character varying NOT NULL, "active" boolean NOT NULL DEFAULT true, "deadline" TIMESTAMP WITH TIME ZONE, "description" character varying NOT NULL, "start_date" TIMESTAMP WITH TIME ZONE NOT NULL, "end_date" TIMESTAMP WITH TIME ZONE, "is_period_not_determined" boolean NOT NULL DEFAULT false, "min_working_hours" integer NOT NULL, "max_working_hours" integer, "link" character varying, "location_id" integer, "organization_id" integer NOT NULL, CONSTRAINT "PK_edcd5446c7b962d9bce4938118c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_1d2faa1fea637fe00d5eb05f56" ON "practice_program" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'super-admin', 'employee')`);
        await queryRunner.query(`CREATE TYPE "public"."user_status_enum" AS ENUM('active', 'restricted', 'pending')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "cognito_id" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'employee', "status" "public"."user_status_enum" NOT NULL DEFAULT 'pending', "organization_id" integer, CONSTRAINT "UQ_24f393ce6efc331a76831ffc814" UNIQUE ("cognito_id"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_773293fdd33ab67c6be087d6be" ON "user" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."organization_activity_area_enum" AS ENUM('Local', 'Regional', 'National', 'International')`);
        await queryRunner.query(`CREATE TABLE "organization_activity" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "area" "public"."organization_activity_area_enum" NOT NULL, "is_part_of_federation" boolean NOT NULL DEFAULT false, "is_part_of_coalition" boolean NOT NULL DEFAULT false, "is_part_of_international_organization" boolean NOT NULL, "international_organization_name" character varying, "is_social_service_viable" boolean NOT NULL, "offers_grants" boolean NOT NULL, "is_public_intrest_organization" boolean NOT NULL, "has_branches" boolean NOT NULL, CONSTRAINT "PK_e769259ba880fd497f2bef4f990" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a055035efc45463d0e0090314c" ON "organization_activity" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."organization_financial_financial_type_enum" AS ENUM('Expense', 'Income')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_financial_completion_status_enum" AS ENUM('Completed', 'Not Completed')`);
        await queryRunner.query(`CREATE TABLE "organization_financial" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "organizationId" integer NOT NULL, "financial_type" "public"."organization_financial_financial_type_enum" NOT NULL, "number_of_employees" integer NOT NULL DEFAULT '0', "year" integer NOT NULL, "total" integer NOT NULL DEFAULT '0', "completion_status" "public"."organization_financial_completion_status_enum" NOT NULL DEFAULT 'Not Completed', "data" jsonb, CONSTRAINT "PK_225f4b7944b681a60ad848b7616" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_2b25c27e5af6d58024c9c824aa" ON "organization_financial" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."organization_general_type_enum" AS ENUM('association', 'foundation', 'federation')`);
        await queryRunner.query(`CREATE TABLE "organization_general" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "alias" text NOT NULL, "type" "public"."organization_general_type_enum" NOT NULL, "email" text NOT NULL, "phone" text NOT NULL, "year_created" integer NOT NULL, "cui" text NOT NULL, "raf_number" text NOT NULL, "short_description" text, "description" text, "logo" text, "website" text NOT NULL, "facebook" text, "instagram" text, "twitter" text, "linkedin" text, "tiktok" text, "donation_website" text, "redirect_link" text, "donation_sms" text, "donation_keyword" text, "contact_person" jsonb NOT NULL, "city_id" integer, "county_id" integer, CONSTRAINT "UQ_58fc88f8fe87816637a917bab2d" UNIQUE ("name"), CONSTRAINT "UQ_47e42462bf81ad236cb374f3294" UNIQUE ("alias"), CONSTRAINT "UQ_b8ce26c42c7d956c3cbd3e85a69" UNIQUE ("email"), CONSTRAINT "UQ_ddbc0472e616242c156ec1153a2" UNIQUE ("phone"), CONSTRAINT "UQ_5114f5d57b18322c6f9c4e57885" UNIQUE ("cui"), CONSTRAINT "UQ_2c684835ca5c25e3bec90b7be29" UNIQUE ("raf_number"), CONSTRAINT "PK_ee0586f7cd1c00ad40d85e5c2c1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_bba17e00f3aa8a6d5f04ad650b" ON "organization_general" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "organization_legal" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "legal_reprezentative_id" integer, "others" jsonb, "organization_statute" character varying, CONSTRAINT "REL_78fadda3f96580002ca70bbf47" UNIQUE ("legal_reprezentative_id"), CONSTRAINT "PK_8c3070567c73cc0816619cad844" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4f5f5fbda223ed5be534ce2a14" ON "organization_legal" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."organization_request_status_enum" AS ENUM('Pending', 'Approved', 'Declined')`);
        await queryRunner.query(`CREATE TABLE "organization_request" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."organization_request_status_enum" NOT NULL DEFAULT 'Pending', "organization_id" integer, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "organization_name" character varying NOT NULL, CONSTRAINT "PK_9644ce71b42025d82f76237ffff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_77a80d92f561e285887f57a251" ON "organization_request" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."organization_status_enum" AS ENUM('active', 'pending', 'restricted')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_completion_status_enum" AS ENUM('Completed', 'Not Completed')`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "synced_on" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."organization_status_enum" NOT NULL DEFAULT 'pending', "completion_status" "public"."organization_completion_status_enum" NOT NULL DEFAULT 'Not Completed', "organization_general_id" integer, "organization_activity_id" integer, "organization_legal_id" integer, "organization_report_id" integer, CONSTRAINT "REL_830b2777f33ab069fd661d0180" UNIQUE ("organization_general_id"), CONSTRAINT "REL_948da9bb3345e7fbd214e13e4a" UNIQUE ("organization_activity_id"), CONSTRAINT "REL_3a3c23b75ef0ea59e5b4907940" UNIQUE ("organization_legal_id"), CONSTRAINT "REL_268663f28fdc0a067223d2f0d2" UNIQUE ("organization_report_id"), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_763748c108da399095b7ee5fcf" ON "organization" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."partner_status_enum" AS ENUM('Completed', 'Not Completed')`);
        await queryRunner.query(`CREATE TABLE "partner" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "year" integer NOT NULL, "number_of_partners" integer DEFAULT '0', "status" "public"."partner_status_enum" NOT NULL DEFAULT 'Not Completed', "path" text, "organizationReportId" integer, CONSTRAINT "PK_8f34ff11ddd5459eacbfacd48ca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cda306930dce3eb6252f68c5d7" ON "partner" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."report_status_enum" AS ENUM('Completed', 'Not Completed')`);
        await queryRunner.query(`CREATE TABLE "report" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "report" text, "number_of_volunteers" integer DEFAULT '0', "number_of_contractors" integer DEFAULT '0', "year" integer NOT NULL, "status" "public"."report_status_enum" NOT NULL DEFAULT 'Not Completed', "organizationReportId" integer, CONSTRAINT "PK_99e4d0bea58cba73c57f935a546" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4a468d6846865e29194b24f56a" ON "report" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "organization_report" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_b91fbe2d9bdf6327e757ae1f112" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7866f447fdab5ae6304b351d8e" ON "organization_report" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."investor_status_enum" AS ENUM('Completed', 'Not Completed')`);
        await queryRunner.query(`CREATE TABLE "investor" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "year" integer NOT NULL, "number_of_investors" integer DEFAULT '0', "status" "public"."investor_status_enum" NOT NULL DEFAULT 'Not Completed', "path" text, "organizationReportId" integer, CONSTRAINT "PK_c60a173349549955c39d3703551" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_033fed1964b622afce113f2eff" ON "investor" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "_city" ("id" integer NOT NULL, "name" text NOT NULL, "county_id" integer, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_beca9451002e9a531c4155cf2e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_71eac5c52a71a62e98911f36b8" ON "_city" ("county_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_304665185f96a904be6fe42449" ON "_city" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."application_history_history_action_enum" AS ENUM('CREATED', 'UPDATED', 'DELETED')`);
        await queryRunner.query(`CREATE TYPE "public"."application_history_type_enum" AS ENUM('independent', 'simple', 'standalone')`);
        await queryRunner.query(`CREATE TYPE "public"."application_history_status_enum" AS ENUM('active', 'disabled')`);
        await queryRunner.query(`CREATE TYPE "public"."application_history_pulling_type_enum" AS ENUM('practice-program', 'civic-service')`);
        await queryRunner.query(`CREATE TABLE "application_history" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "history_original_id" integer NOT NULL, "history_action" "public"."application_history_history_action_enum" NOT NULL DEFAULT 'CREATED', "name" text NOT NULL, "type" "public"."application_history_type_enum" NOT NULL, "status" "public"."application_history_status_enum" NOT NULL DEFAULT 'active', "pulling_type" "public"."application_history_pulling_type_enum", "steps" jsonb, "short_description" text NOT NULL, "description" text NOT NULL, "website" text NOT NULL, "login_link" text, "video_link" text NOT NULL, "logo" text, CONSTRAINT "PK_cfaef81d8ab33ced714ecda2486" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fb66e0cb3462952d64ecabfc5d" ON "application_history" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."ong_application_status_enum" AS ENUM('active', 'pending', 'restricted', 'pending-removal')`);
        await queryRunner.query(`CREATE TABLE "ong_application" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "organization_id" integer NOT NULL, "application_id" integer NOT NULL, "status" "public"."ong_application_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_55d84a7915f5fa954c20abd56ba" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a3a4f4a6845acba124f15d1d60" ON "ong_application" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."application_type_enum" AS ENUM('independent', 'simple', 'standalone')`);
        await queryRunner.query(`CREATE TYPE "public"."application_status_enum" AS ENUM('active', 'disabled')`);
        await queryRunner.query(`CREATE TYPE "public"."application_pulling_type_enum" AS ENUM('practice-program', 'civic-service')`);
        await queryRunner.query(`CREATE TABLE "application" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" text NOT NULL, "type" "public"."application_type_enum" NOT NULL, "status" "public"."application_status_enum" NOT NULL DEFAULT 'active', "pulling_type" "public"."application_pulling_type_enum", "steps" jsonb, "short_description" text NOT NULL, "description" text NOT NULL, "website" text NOT NULL, "login_link" text, "video_link" text NOT NULL, "logo" text, "cognito_client_id" text, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b4252f594dc488e5ef3f3ea515" ON "application" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."ong_application_history_history_action_enum" AS ENUM('CREATED', 'UPDATED', 'DELETED')`);
        await queryRunner.query(`CREATE TYPE "public"."ong_application_history_status_enum" AS ENUM('active', 'pending', 'restricted', 'pending-removal')`);
        await queryRunner.query(`CREATE TABLE "ong_application_history" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "history_original_id" integer NOT NULL, "history_action" "public"."ong_application_history_history_action_enum" NOT NULL DEFAULT 'CREATED', "organization_id" integer NOT NULL, "application_id" integer NOT NULL, "status" "public"."ong_application_history_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_7a9da060c9347c2cf0a78373053" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ef68e3c947f500128e31b4fd24" ON "ong_application_history" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."user_ong_application_status_enum" AS ENUM('active', 'restricted')`);
        await queryRunner.query(`CREATE TABLE "user_ong_application" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "user_id" integer NOT NULL, "ong_application_id" integer NOT NULL, "status" "public"."user_ong_application_status_enum" NOT NULL DEFAULT 'active', CONSTRAINT "PK_77285230a57713fe1f1159e9f1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_70dc4290ab037ad10639bfdb02" ON "user_ong_application" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."organization_history_history_action_enum" AS ENUM('CREATED', 'UPDATED', 'DELETED')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_history_status_enum" AS ENUM('active', 'pending', 'restricted')`);
        await queryRunner.query(`CREATE TABLE "organization_history" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "history_original_id" integer NOT NULL, "history_action" "public"."organization_history_history_action_enum" NOT NULL DEFAULT 'CREATED', "synced_on" TIMESTAMP WITH TIME ZONE NOT NULL, "status" "public"."organization_history_status_enum" NOT NULL DEFAULT 'pending', "organization_general_id" integer, "organization_activity_id" integer, "organization_legal_id" integer, "organization_report_id" integer, CONSTRAINT "PK_fba3160e68c7ea5f28a8d71ad60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_504b4230bdbf8a1d69073fb8c0" ON "organization_history" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."organization_request_history_status_enum" AS ENUM('Pending', 'Approved', 'Declined')`);
        await queryRunner.query(`CREATE TYPE "public"."organization_request_history_history_action_enum" AS ENUM('CREATED', 'UPDATED', 'DELETED')`);
        await queryRunner.query(`CREATE TABLE "organization_request_history" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "status" "public"."organization_request_history_status_enum" NOT NULL DEFAULT 'Pending', "organization_id" integer, "history_original_id" integer NOT NULL, "history_action" "public"."organization_request_history_history_action_enum" NOT NULL DEFAULT 'CREATED', "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "organization_name" character varying NOT NULL, CONSTRAINT "PK_c6b64549591e77e47df608ff56e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_74e483638238b684d0c3513c6a" ON "organization_request_history" ("created_on") `);
        await queryRunner.query(`CREATE TYPE "public"."user_history_history_action_enum" AS ENUM('CREATED', 'UPDATED', 'DELETED')`);
        await queryRunner.query(`CREATE TYPE "public"."user_history_role_enum" AS ENUM('admin', 'super-admin', 'employee')`);
        await queryRunner.query(`CREATE TYPE "public"."user_history_status_enum" AS ENUM('active', 'restricted', 'pending')`);
        await queryRunner.query(`CREATE TABLE "user_history" ("id" SERIAL NOT NULL, "deleted_on" TIMESTAMP WITH TIME ZONE, "created_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_on" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "history_original_id" integer NOT NULL, "history_action" "public"."user_history_history_action_enum" NOT NULL DEFAULT 'CREATED', "cognito_id" character varying, "name" character varying NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "role" "public"."user_history_role_enum" NOT NULL DEFAULT 'employee', "status" "public"."user_history_status_enum" NOT NULL DEFAULT 'pending', "organization_id" integer, CONSTRAINT "PK_777252b9045d8011ab83c5b0834" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5d76b26c5aa965a54cb0db587b" ON "user_history" ("created_on") `);
        await queryRunner.query(`CREATE TABLE "civic_center_service_to_domain" ("civic_center_service_id" integer NOT NULL, "domain_id" integer NOT NULL, CONSTRAINT "PK_4f0a916909bee01e91b1a56e460" PRIMARY KEY ("civic_center_service_id", "domain_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9b9a9f5f1bc797af28de1e59fb" ON "civic_center_service_to_domain" ("civic_center_service_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_ba35ffccfe64615402f5616032" ON "civic_center_service_to_domain" ("domain_id") `);
        await queryRunner.query(`CREATE TABLE "practice_program_to_domain" ("practice_program_id" integer NOT NULL, "domain_id" integer NOT NULL, CONSTRAINT "PK_d4ac5f18f6fedd5551dc1615fa7" PRIMARY KEY ("practice_program_id", "domain_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9e665b330b32c43ec07e1a48ba" ON "practice_program_to_domain" ("practice_program_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_18caf25ce978b4a40583b5b56b" ON "practice_program_to_domain" ("domain_id") `);
        await queryRunner.query(`CREATE TABLE "practice_program_to_faculty" ("practice_program_id" integer NOT NULL, "faculty_id" integer NOT NULL, CONSTRAINT "PK_523fb9d9ec931ae96221fb251bd" PRIMARY KEY ("practice_program_id", "faculty_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_70c5071d2af65824c309b1ff91" ON "practice_program_to_faculty" ("practice_program_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f303cf9c3f8d1225fdf9d68766" ON "practice_program_to_faculty" ("faculty_id") `);
        await queryRunner.query(`CREATE TABLE "practice_program_to_skill" ("practice_program_id" integer NOT NULL, "skill_id" integer NOT NULL, CONSTRAINT "PK_2683a52adb1bc3219877586da0a" PRIMARY KEY ("practice_program_id", "skill_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e5f33d2a0468d573feb0de56ac" ON "practice_program_to_skill" ("practice_program_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d1bb3cd183678350055277a2b2" ON "practice_program_to_skill" ("skill_id") `);
        await queryRunner.query(`CREATE TABLE "activity_to_federations" ("organization_activity_id" integer NOT NULL, "federation_id" integer NOT NULL, CONSTRAINT "PK_2434901d6ee7b2c23066bece2aa" PRIMARY KEY ("organization_activity_id", "federation_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6d9a8213373642eaf23da17e9d" ON "activity_to_federations" ("organization_activity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_7dd20eb04cbfe7e2238f0304f2" ON "activity_to_federations" ("federation_id") `);
        await queryRunner.query(`CREATE TABLE "activity_to_coalitions" ("organization_activity_id" integer NOT NULL, "coalition_id" integer NOT NULL, CONSTRAINT "PK_8bf0e62129d01b8c2ca6a49c5e0" PRIMARY KEY ("organization_activity_id", "coalition_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56130e9dc86973a9d508929025" ON "activity_to_coalitions" ("organization_activity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_300d749f9bb4d87198afbbb239" ON "activity_to_coalitions" ("coalition_id") `);
        await queryRunner.query(`CREATE TABLE "activity_to_branches" ("organization_activity_id" integer NOT NULL, "city_id" integer NOT NULL, CONSTRAINT "PK_c564743f6134ecf4b96b4a2b92b" PRIMARY KEY ("organization_activity_id", "city_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_95241789f7ab4b83284ecd1f1b" ON "activity_to_branches" ("organization_activity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_be0ad8ce6991b21ac87f043353" ON "activity_to_branches" ("city_id") `);
        await queryRunner.query(`CREATE TABLE "activity_to_region" ("organization_activity_id" integer NOT NULL, "region_id" integer NOT NULL, CONSTRAINT "PK_eb517cde4d2d1845970d2e8644f" PRIMARY KEY ("organization_activity_id", "region_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4644ae2b59846f7bc322fd8200" ON "activity_to_region" ("organization_activity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d08a9869c70f9cd18d7531ad1d" ON "activity_to_region" ("region_id") `);
        await queryRunner.query(`CREATE TABLE "activity_to_city" ("organization_activity_id" integer NOT NULL, "city_id" integer NOT NULL, CONSTRAINT "PK_5c5a0ba482b16ae4c66586a981d" PRIMARY KEY ("organization_activity_id", "city_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c4f26c86ce92726147a067245c" ON "activity_to_city" ("organization_activity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c073ebd439817573b6c064bc0a" ON "activity_to_city" ("city_id") `);
        await queryRunner.query(`CREATE TABLE "activity_to_domain" ("organization_activity_id" integer NOT NULL, "domain_id" integer NOT NULL, CONSTRAINT "PK_f05c4845226cdfd32d0f825e0a6" PRIMARY KEY ("organization_activity_id", "domain_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_79862129d99c2051380a0a7f99" ON "activity_to_domain" ("organization_activity_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_21dcf6fc7881954e9e47bbacc3" ON "activity_to_domain" ("domain_id") `);
        await queryRunner.query(`CREATE TABLE "legal_to_contacts" ("organization_legal_id" integer NOT NULL, "contact_id" integer NOT NULL, CONSTRAINT "PK_f522a4490ce2e5dbffb3367f68b" PRIMARY KEY ("organization_legal_id", "contact_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_72f72568e60ab77b7d8eb3c988" ON "legal_to_contacts" ("organization_legal_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_24dc1e9d979931e9e9cacf2877" ON "legal_to_contacts" ("contact_id") `);
        await queryRunner.query(`ALTER TABLE "_county" ADD CONSTRAINT "FK_806f2632bf2d7cbf69b408fb025" FOREIGN KEY ("region_id") REFERENCES "_region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "feedback" ADD CONSTRAINT "FK_7ccc3d4245e0a7bc33494b61968" FOREIGN KEY ("civic_center_service_id") REFERENCES "civic_center_service"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "civic_center_service" ADD CONSTRAINT "FK_9ca76e8040556d53ef79fc543e7" FOREIGN KEY ("location_id") REFERENCES "_city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "civic_center_service" ADD CONSTRAINT "FK_39ac276a55d01e0916907e9993a" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "practice_program" ADD CONSTRAINT "FK_fe07c08f3644c8e25ff9063fcc2" FOREIGN KEY ("location_id") REFERENCES "_city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "practice_program" ADD CONSTRAINT "FK_a9a0f4b8d8f15b90c94853bed38" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_3e103cdf85b7d6cb620b4db0f0c" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_financial" ADD CONSTRAINT "FK_e60b7f4fc14c330641593ff7f17" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_general" ADD CONSTRAINT "FK_0efafc124004fc57e5a1a78ebe3" FOREIGN KEY ("city_id") REFERENCES "_city"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_general" ADD CONSTRAINT "FK_917a7853c237adb38a43715aadb" FOREIGN KEY ("county_id") REFERENCES "_county"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_legal" ADD CONSTRAINT "FK_78fadda3f96580002ca70bbf47f" FOREIGN KEY ("legal_reprezentative_id") REFERENCES "_contact"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_request" ADD CONSTRAINT "FK_119a286932314f3cce55f092af7" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_830b2777f33ab069fd661d01806" FOREIGN KEY ("organization_general_id") REFERENCES "organization_general"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_948da9bb3345e7fbd214e13e4ac" FOREIGN KEY ("organization_activity_id") REFERENCES "organization_activity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_3a3c23b75ef0ea59e5b49079400" FOREIGN KEY ("organization_legal_id") REFERENCES "organization_legal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization" ADD CONSTRAINT "FK_268663f28fdc0a067223d2f0d21" FOREIGN KEY ("organization_report_id") REFERENCES "organization_report"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "partner" ADD CONSTRAINT "FK_d70f4bdb04f0a5d4af7b4a833c6" FOREIGN KEY ("organizationReportId") REFERENCES "organization_report"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "report" ADD CONSTRAINT "FK_77c42ab83807a9ddeed1032e9b8" FOREIGN KEY ("organizationReportId") REFERENCES "organization_report"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "investor" ADD CONSTRAINT "FK_913b8f4fffc31409cbcb3dc1e21" FOREIGN KEY ("organizationReportId") REFERENCES "organization_report"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "_city" ADD CONSTRAINT "FK_71eac5c52a71a62e98911f36b8b" FOREIGN KEY ("county_id") REFERENCES "_county"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ong_application" ADD CONSTRAINT "FK_15f57e727d2c7f3f3012e6b2aec" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ong_application" ADD CONSTRAINT "FK_17313fa999d00e3904b1a7b0375" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_ong_application" ADD CONSTRAINT "FK_724b25bdbea31cd8304ed0bc88e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_ong_application" ADD CONSTRAINT "FK_d6f217cef48b2f71404ff70ec13" FOREIGN KEY ("ong_application_id") REFERENCES "ong_application"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "organization_request_history" ADD CONSTRAINT "FK_6e80441ed55aabf83c15ccdda74" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "civic_center_service_to_domain" ADD CONSTRAINT "FK_9b9a9f5f1bc797af28de1e59fb5" FOREIGN KEY ("civic_center_service_id") REFERENCES "civic_center_service"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "civic_center_service_to_domain" ADD CONSTRAINT "FK_ba35ffccfe64615402f5616032f" FOREIGN KEY ("domain_id") REFERENCES "_domain"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_domain" ADD CONSTRAINT "FK_9e665b330b32c43ec07e1a48ba7" FOREIGN KEY ("practice_program_id") REFERENCES "practice_program"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_domain" ADD CONSTRAINT "FK_18caf25ce978b4a40583b5b56b0" FOREIGN KEY ("domain_id") REFERENCES "_domain"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_faculty" ADD CONSTRAINT "FK_70c5071d2af65824c309b1ff917" FOREIGN KEY ("practice_program_id") REFERENCES "practice_program"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_faculty" ADD CONSTRAINT "FK_f303cf9c3f8d1225fdf9d68766a" FOREIGN KEY ("faculty_id") REFERENCES "_faculty"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_skill" ADD CONSTRAINT "FK_e5f33d2a0468d573feb0de56ac2" FOREIGN KEY ("practice_program_id") REFERENCES "practice_program"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_skill" ADD CONSTRAINT "FK_d1bb3cd183678350055277a2b2b" FOREIGN KEY ("skill_id") REFERENCES "_skill"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_federations" ADD CONSTRAINT "FK_6d9a8213373642eaf23da17e9d8" FOREIGN KEY ("organization_activity_id") REFERENCES "organization_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_federations" ADD CONSTRAINT "FK_7dd20eb04cbfe7e2238f0304f2c" FOREIGN KEY ("federation_id") REFERENCES "_federation"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_coalitions" ADD CONSTRAINT "FK_56130e9dc86973a9d5089290259" FOREIGN KEY ("organization_activity_id") REFERENCES "organization_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_coalitions" ADD CONSTRAINT "FK_300d749f9bb4d87198afbbb2390" FOREIGN KEY ("coalition_id") REFERENCES "_coalition"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_branches" ADD CONSTRAINT "FK_95241789f7ab4b83284ecd1f1b7" FOREIGN KEY ("organization_activity_id") REFERENCES "organization_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_branches" ADD CONSTRAINT "FK_be0ad8ce6991b21ac87f043353f" FOREIGN KEY ("city_id") REFERENCES "_city"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_region" ADD CONSTRAINT "FK_4644ae2b59846f7bc322fd82002" FOREIGN KEY ("organization_activity_id") REFERENCES "organization_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_region" ADD CONSTRAINT "FK_d08a9869c70f9cd18d7531ad1df" FOREIGN KEY ("region_id") REFERENCES "_region"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_city" ADD CONSTRAINT "FK_c4f26c86ce92726147a067245c1" FOREIGN KEY ("organization_activity_id") REFERENCES "organization_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_city" ADD CONSTRAINT "FK_c073ebd439817573b6c064bc0ad" FOREIGN KEY ("city_id") REFERENCES "_city"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_domain" ADD CONSTRAINT "FK_79862129d99c2051380a0a7f991" FOREIGN KEY ("organization_activity_id") REFERENCES "organization_activity"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activity_to_domain" ADD CONSTRAINT "FK_21dcf6fc7881954e9e47bbacc31" FOREIGN KEY ("domain_id") REFERENCES "_domain"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "legal_to_contacts" ADD CONSTRAINT "FK_72f72568e60ab77b7d8eb3c988d" FOREIGN KEY ("organization_legal_id") REFERENCES "organization_legal"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "legal_to_contacts" ADD CONSTRAINT "FK_24dc1e9d979931e9e9cacf28773" FOREIGN KEY ("contact_id") REFERENCES "_contact"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`CREATE VIEW "OrganizationView" AS SELECT "organization".id as "id", "organization".status AS "status", "organization".created_on as "createdOn", "organization".updated_on as "updatedOn", "organization".completion_status as "completionStatus", "organization_general".name as "name", COUNT("user".id) as "userCount", "organization_general".logo as "logo" FROM "organization" "organization"
    LEFT JOIN "organization_general" "organization_general" ON "organization".organization_general_id = "organization_general".id
    LEFT JOIN "user" "user" ON "user".organization_id = "organization".id AND "user".deleted_on IS NULL AND "user".role = 'employee' and "user".status != 'pending'
    WHERE "organization".status != 'pending'
    GROUP BY "organization".id, "organization_general".id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","OrganizationView","SELECT \"organization\".id as \"id\", \"organization\".status AS \"status\", \"organization\".created_on as \"createdOn\", \"organization\".updated_on as \"updatedOn\", \"organization\".completion_status as \"completionStatus\", \"organization_general\".name as \"name\", COUNT(\"user\".id) as \"userCount\", \"organization_general\".logo as \"logo\" FROM \"organization\" \"organization\"\n    LEFT JOIN \"organization_general\" \"organization_general\" ON \"organization\".organization_general_id = \"organization_general\".id\n    LEFT JOIN \"user\" \"user\" ON \"user\".organization_id = \"organization\".id AND \"user\".deleted_on IS NULL AND \"user\".role = 'employee' and \"user\".status != 'pending'\n    WHERE \"organization\".status != 'pending'\n    GROUP BY \"organization\".id, \"organization_general\".id"]);
        await queryRunner.query(`CREATE VIEW "ApplicationTableView" AS SELECT "application".id as "id",
  "application".logo as "logo", 
  "application".name as "name",
  "application".type as "type", 
  "application".status as "status",
  COUNT(DISTINCT("ong_application".organization_id)) as "organizationCount",
  COUNT(DISTINCT("user_ong_application".user_id)) as "userCount"
  FROM "application" 
  LEFT JOIN "ong_application" "ong_application" ON "ong_application".application_id = "application".id
  LEFT JOIN "user_ong_application" "user_ong_application" ON "user_ong_application".ong_application_id = "ong_application".id
  GROUP BY "application".id
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","ApplicationTableView","SELECT \"application\".id as \"id\",\n  \"application\".logo as \"logo\", \n  \"application\".name as \"name\",\n  \"application\".type as \"type\", \n  \"application\".status as \"status\",\n  COUNT(DISTINCT(\"ong_application\".organization_id)) as \"organizationCount\",\n  COUNT(DISTINCT(\"user_ong_application\".user_id)) as \"userCount\"\n  FROM \"application\" \n  LEFT JOIN \"ong_application\" \"ong_application\" ON \"ong_application\".application_id = \"application\".id\n  LEFT JOIN \"user_ong_application\" \"user_ong_application\" ON \"user_ong_application\".ong_application_id = \"ong_application\".id\n  GROUP BY \"application\".id"]);
        await queryRunner.query(`CREATE VIEW "ApplicationOngView" AS 
  SELECT "application".id as "applicationId", 
  "organization".id as "organizationId",
  "organization_general".logo as "logo", 
  "organization_general".name as "name", 
  COUNT("user_ong_application".id) as "userCount", 
  "organization".created_on as "createdOn", 
  "ong_application".status as "status"
  FROM "organization" 
  LEFT JOIN "ong_application" "ong_application" ON "ong_application".organization_id = "organization".id
  LEFT JOIN "application" "application" ON "application".id = "ong_application".application_id
  LEFT JOIN "organization_general" "organization_general" ON "organization_general".id = "organization".organization_general_id
  LEFT JOIN "user_ong_application" "user_ong_application" ON "user_ong_application".ong_application_id = "ong_application".id
  WHERE "ong_application".status != 'pending'
  GROUP BY "organization".id, "organization_general".id, "ong_application".id, "application".id`);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","ApplicationOngView","SELECT \"application\".id as \"applicationId\", \n  \"organization\".id as \"organizationId\",\n  \"organization_general\".logo as \"logo\", \n  \"organization_general\".name as \"name\", \n  COUNT(\"user_ong_application\".id) as \"userCount\", \n  \"organization\".created_on as \"createdOn\", \n  \"ong_application\".status as \"status\"\n  FROM \"organization\" \n  LEFT JOIN \"ong_application\" \"ong_application\" ON \"ong_application\".organization_id = \"organization\".id\n  LEFT JOIN \"application\" \"application\" ON \"application\".id = \"ong_application\".application_id\n  LEFT JOIN \"organization_general\" \"organization_general\" ON \"organization_general\".id = \"organization\".organization_general_id\n  LEFT JOIN \"user_ong_application\" \"user_ong_application\" ON \"user_ong_application\".ong_application_id = \"ong_application\".id\n  WHERE \"ong_application\".status != 'pending'\n  GROUP BY \"organization\".id, \"organization_general\".id, \"ong_application\".id, \"application\".id"]);
        await queryRunner.query(`CREATE VIEW "OrganizationStatusStatisticsView" AS with 
date_day_series as (
    select 
        date_trunc('day', (current_date - offs)) as day
    from generate_series(0, 365*5, 1) as offs),

--generates month series for the last 5 years from current_date
date_month_series as (
    select 
		distinct date_trunc('month', day) as month 
    from date_day_series
),

--generates year series for the last 5 years from current date
date_year_series as (
    select 
		distinct date_trunc('year', month) as year 
    from date_month_series
)

--returns the latest status for each day
select 
    to_char(date_trunc('day', daily_status.day), 'DD Mon') as date,
    daily_status.status,
    case 
        when daily_status.status is not null 
            then count(*) 
        else 0
    end as count,
    'daily' as type
from (
    --ranking of the statuses/days
    select
        rank() over (
            partition by day_series.day, 
                         org_hist.history_original_id
            order by org_hist.updated_on desc
        ) as rnk,
        day_series.day,
        org_hist.status,
        org_hist.updated_on,
        org_hist.history_original_id

    from date_day_series day_series

    left join "organization_history" org_hist
        on date_trunc('day', org_hist.updated_on) <= day_series.day

    where day_series.day > date_trunc('day', (current_date - 30))
    ) daily_status
where daily_status.rnk = 1

group by daily_status.day, 
         daily_status.status

union all 
--returns the latest status for each month
select 
    to_char(date_trunc('month', monthly_status.month), 'Mon YYYY') as date,
    monthly_status.status,
    case 
        when monthly_status.status is not null 
            then count(*) 
        else 0
    end as count,
    'monthly' as type 
from (
    --ranking of the statuses/months
    select
        rank() over (
            partition by month_series.month, 
                         org_hist.history_original_id
            order by org_hist.updated_on desc
        ) as rnk,
        month_series.month,
        org_hist.status,
        org_hist.updated_on,
        org_hist.history_original_id

    from date_month_series month_series

    left join "organization_history" org_hist
        on date_trunc('month', org_hist.updated_on) <= date_trunc('month', month_series.month)
    
    where date_trunc('month', month_series.month) > date_trunc('day', (current_date - 365))
    ) monthly_status
where monthly_status.rnk=1

group by monthly_status.month, 
         monthly_status.status
union all
--returns the latest status for each year
select 
    to_char(date_trunc('year', yearly_status.year), 'YYYY') as date,
    yearly_status.status,
    case 
        when yearly_status.status is not null 
            then count(*) 
        else 0
    end as count,
    'yearly' as type 
from (
    --ranking of the statuses/years
    select
        rank() over (
            partition by year_series.year, 
                         org_hist.history_original_id
            order by org_hist.updated_on desc
        ) as rnk,
        year_series.year,
        org_hist.status,
        org_hist.updated_on,
        org_hist.history_original_id

    from date_year_series year_series

    left join "organization_history" org_hist
        on date_trunc('year', org_hist.updated_on) <= date_trunc('year', year_series.year)
    
    where date_trunc('year', year_series.year) > date_trunc('year', (current_date - 365*5))
    ) yearly_status
where yearly_status.rnk=1
group by yearly_status.year, yearly_status.status
  `);
        await queryRunner.query(`INSERT INTO "typeorm_metadata"("database", "schema", "table", "type", "name", "value") VALUES (DEFAULT, $1, DEFAULT, $2, $3, $4)`, ["public","VIEW","OrganizationStatusStatisticsView","with \ndate_day_series as (\n    select \n        date_trunc('day', (current_date - offs)) as day\n    from generate_series(0, 365*5, 1) as offs),\n\n--generates month series for the last 5 years from current_date\ndate_month_series as (\n    select \n\t\tdistinct date_trunc('month', day) as month \n    from date_day_series\n),\n\n--generates year series for the last 5 years from current date\ndate_year_series as (\n    select \n\t\tdistinct date_trunc('year', month) as year \n    from date_month_series\n)\n\n--returns the latest status for each day\nselect \n    to_char(date_trunc('day', daily_status.day), 'DD Mon') as date,\n    daily_status.status,\n    case \n        when daily_status.status is not null \n            then count(*) \n        else 0\n    end as count,\n    'daily' as type\nfrom (\n    --ranking of the statuses/days\n    select\n        rank() over (\n            partition by day_series.day, \n                         org_hist.history_original_id\n            order by org_hist.updated_on desc\n        ) as rnk,\n        day_series.day,\n        org_hist.status,\n        org_hist.updated_on,\n        org_hist.history_original_id\n\n    from date_day_series day_series\n\n    left join \"organization_history\" org_hist\n        on date_trunc('day', org_hist.updated_on) <= day_series.day\n\n    where day_series.day > date_trunc('day', (current_date - 30))\n    ) daily_status\nwhere daily_status.rnk = 1\n\ngroup by daily_status.day, \n         daily_status.status\n\nunion all \n--returns the latest status for each month\nselect \n    to_char(date_trunc('month', monthly_status.month), 'Mon YYYY') as date,\n    monthly_status.status,\n    case \n        when monthly_status.status is not null \n            then count(*) \n        else 0\n    end as count,\n    'monthly' as type \nfrom (\n    --ranking of the statuses/months\n    select\n        rank() over (\n            partition by month_series.month, \n                         org_hist.history_original_id\n            order by org_hist.updated_on desc\n        ) as rnk,\n        month_series.month,\n        org_hist.status,\n        org_hist.updated_on,\n        org_hist.history_original_id\n\n    from date_month_series month_series\n\n    left join \"organization_history\" org_hist\n        on date_trunc('month', org_hist.updated_on) <= date_trunc('month', month_series.month)\n    \n    where date_trunc('month', month_series.month) > date_trunc('day', (current_date - 365))\n    ) monthly_status\nwhere monthly_status.rnk=1\n\ngroup by monthly_status.month, \n         monthly_status.status\nunion all\n--returns the latest status for each year\nselect \n    to_char(date_trunc('year', yearly_status.year), 'YYYY') as date,\n    yearly_status.status,\n    case \n        when yearly_status.status is not null \n            then count(*) \n        else 0\n    end as count,\n    'yearly' as type \nfrom (\n    --ranking of the statuses/years\n    select\n        rank() over (\n            partition by year_series.year, \n                         org_hist.history_original_id\n            order by org_hist.updated_on desc\n        ) as rnk,\n        year_series.year,\n        org_hist.status,\n        org_hist.updated_on,\n        org_hist.history_original_id\n\n    from date_year_series year_series\n\n    left join \"organization_history\" org_hist\n        on date_trunc('year', org_hist.updated_on) <= date_trunc('year', year_series.year)\n    \n    where date_trunc('year', year_series.year) > date_trunc('year', (current_date - 365*5))\n    ) yearly_status\nwhere yearly_status.rnk=1\ngroup by yearly_status.year, yearly_status.status"]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","OrganizationStatusStatisticsView","public"]);
        await queryRunner.query(`DROP VIEW "OrganizationStatusStatisticsView"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","ApplicationOngView","public"]);
        await queryRunner.query(`DROP VIEW "ApplicationOngView"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","ApplicationTableView","public"]);
        await queryRunner.query(`DROP VIEW "ApplicationTableView"`);
        await queryRunner.query(`DELETE FROM "typeorm_metadata" WHERE "type" = $1 AND "name" = $2 AND "schema" = $3`, ["VIEW","OrganizationView","public"]);
        await queryRunner.query(`DROP VIEW "OrganizationView"`);
        await queryRunner.query(`ALTER TABLE "legal_to_contacts" DROP CONSTRAINT "FK_24dc1e9d979931e9e9cacf28773"`);
        await queryRunner.query(`ALTER TABLE "legal_to_contacts" DROP CONSTRAINT "FK_72f72568e60ab77b7d8eb3c988d"`);
        await queryRunner.query(`ALTER TABLE "activity_to_domain" DROP CONSTRAINT "FK_21dcf6fc7881954e9e47bbacc31"`);
        await queryRunner.query(`ALTER TABLE "activity_to_domain" DROP CONSTRAINT "FK_79862129d99c2051380a0a7f991"`);
        await queryRunner.query(`ALTER TABLE "activity_to_city" DROP CONSTRAINT "FK_c073ebd439817573b6c064bc0ad"`);
        await queryRunner.query(`ALTER TABLE "activity_to_city" DROP CONSTRAINT "FK_c4f26c86ce92726147a067245c1"`);
        await queryRunner.query(`ALTER TABLE "activity_to_region" DROP CONSTRAINT "FK_d08a9869c70f9cd18d7531ad1df"`);
        await queryRunner.query(`ALTER TABLE "activity_to_region" DROP CONSTRAINT "FK_4644ae2b59846f7bc322fd82002"`);
        await queryRunner.query(`ALTER TABLE "activity_to_branches" DROP CONSTRAINT "FK_be0ad8ce6991b21ac87f043353f"`);
        await queryRunner.query(`ALTER TABLE "activity_to_branches" DROP CONSTRAINT "FK_95241789f7ab4b83284ecd1f1b7"`);
        await queryRunner.query(`ALTER TABLE "activity_to_coalitions" DROP CONSTRAINT "FK_300d749f9bb4d87198afbbb2390"`);
        await queryRunner.query(`ALTER TABLE "activity_to_coalitions" DROP CONSTRAINT "FK_56130e9dc86973a9d5089290259"`);
        await queryRunner.query(`ALTER TABLE "activity_to_federations" DROP CONSTRAINT "FK_7dd20eb04cbfe7e2238f0304f2c"`);
        await queryRunner.query(`ALTER TABLE "activity_to_federations" DROP CONSTRAINT "FK_6d9a8213373642eaf23da17e9d8"`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_skill" DROP CONSTRAINT "FK_d1bb3cd183678350055277a2b2b"`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_skill" DROP CONSTRAINT "FK_e5f33d2a0468d573feb0de56ac2"`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_faculty" DROP CONSTRAINT "FK_f303cf9c3f8d1225fdf9d68766a"`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_faculty" DROP CONSTRAINT "FK_70c5071d2af65824c309b1ff917"`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_domain" DROP CONSTRAINT "FK_18caf25ce978b4a40583b5b56b0"`);
        await queryRunner.query(`ALTER TABLE "practice_program_to_domain" DROP CONSTRAINT "FK_9e665b330b32c43ec07e1a48ba7"`);
        await queryRunner.query(`ALTER TABLE "civic_center_service_to_domain" DROP CONSTRAINT "FK_ba35ffccfe64615402f5616032f"`);
        await queryRunner.query(`ALTER TABLE "civic_center_service_to_domain" DROP CONSTRAINT "FK_9b9a9f5f1bc797af28de1e59fb5"`);
        await queryRunner.query(`ALTER TABLE "organization_request_history" DROP CONSTRAINT "FK_6e80441ed55aabf83c15ccdda74"`);
        await queryRunner.query(`ALTER TABLE "user_ong_application" DROP CONSTRAINT "FK_d6f217cef48b2f71404ff70ec13"`);
        await queryRunner.query(`ALTER TABLE "user_ong_application" DROP CONSTRAINT "FK_724b25bdbea31cd8304ed0bc88e"`);
        await queryRunner.query(`ALTER TABLE "ong_application" DROP CONSTRAINT "FK_17313fa999d00e3904b1a7b0375"`);
        await queryRunner.query(`ALTER TABLE "ong_application" DROP CONSTRAINT "FK_15f57e727d2c7f3f3012e6b2aec"`);
        await queryRunner.query(`ALTER TABLE "_city" DROP CONSTRAINT "FK_71eac5c52a71a62e98911f36b8b"`);
        await queryRunner.query(`ALTER TABLE "investor" DROP CONSTRAINT "FK_913b8f4fffc31409cbcb3dc1e21"`);
        await queryRunner.query(`ALTER TABLE "report" DROP CONSTRAINT "FK_77c42ab83807a9ddeed1032e9b8"`);
        await queryRunner.query(`ALTER TABLE "partner" DROP CONSTRAINT "FK_d70f4bdb04f0a5d4af7b4a833c6"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_268663f28fdc0a067223d2f0d21"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_3a3c23b75ef0ea59e5b49079400"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_948da9bb3345e7fbd214e13e4ac"`);
        await queryRunner.query(`ALTER TABLE "organization" DROP CONSTRAINT "FK_830b2777f33ab069fd661d01806"`);
        await queryRunner.query(`ALTER TABLE "organization_request" DROP CONSTRAINT "FK_119a286932314f3cce55f092af7"`);
        await queryRunner.query(`ALTER TABLE "organization_legal" DROP CONSTRAINT "FK_78fadda3f96580002ca70bbf47f"`);
        await queryRunner.query(`ALTER TABLE "organization_general" DROP CONSTRAINT "FK_917a7853c237adb38a43715aadb"`);
        await queryRunner.query(`ALTER TABLE "organization_general" DROP CONSTRAINT "FK_0efafc124004fc57e5a1a78ebe3"`);
        await queryRunner.query(`ALTER TABLE "organization_financial" DROP CONSTRAINT "FK_e60b7f4fc14c330641593ff7f17"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_3e103cdf85b7d6cb620b4db0f0c"`);
        await queryRunner.query(`ALTER TABLE "practice_program" DROP CONSTRAINT "FK_a9a0f4b8d8f15b90c94853bed38"`);
        await queryRunner.query(`ALTER TABLE "practice_program" DROP CONSTRAINT "FK_fe07c08f3644c8e25ff9063fcc2"`);
        await queryRunner.query(`ALTER TABLE "civic_center_service" DROP CONSTRAINT "FK_39ac276a55d01e0916907e9993a"`);
        await queryRunner.query(`ALTER TABLE "civic_center_service" DROP CONSTRAINT "FK_9ca76e8040556d53ef79fc543e7"`);
        await queryRunner.query(`ALTER TABLE "feedback" DROP CONSTRAINT "FK_7ccc3d4245e0a7bc33494b61968"`);
        await queryRunner.query(`ALTER TABLE "_county" DROP CONSTRAINT "FK_806f2632bf2d7cbf69b408fb025"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_24dc1e9d979931e9e9cacf2877"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_72f72568e60ab77b7d8eb3c988"`);
        await queryRunner.query(`DROP TABLE "legal_to_contacts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_21dcf6fc7881954e9e47bbacc3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_79862129d99c2051380a0a7f99"`);
        await queryRunner.query(`DROP TABLE "activity_to_domain"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c073ebd439817573b6c064bc0a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4f26c86ce92726147a067245c"`);
        await queryRunner.query(`DROP TABLE "activity_to_city"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d08a9869c70f9cd18d7531ad1d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4644ae2b59846f7bc322fd8200"`);
        await queryRunner.query(`DROP TABLE "activity_to_region"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_be0ad8ce6991b21ac87f043353"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_95241789f7ab4b83284ecd1f1b"`);
        await queryRunner.query(`DROP TABLE "activity_to_branches"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_300d749f9bb4d87198afbbb239"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56130e9dc86973a9d508929025"`);
        await queryRunner.query(`DROP TABLE "activity_to_coalitions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7dd20eb04cbfe7e2238f0304f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6d9a8213373642eaf23da17e9d"`);
        await queryRunner.query(`DROP TABLE "activity_to_federations"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1bb3cd183678350055277a2b2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e5f33d2a0468d573feb0de56ac"`);
        await queryRunner.query(`DROP TABLE "practice_program_to_skill"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f303cf9c3f8d1225fdf9d68766"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70c5071d2af65824c309b1ff91"`);
        await queryRunner.query(`DROP TABLE "practice_program_to_faculty"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_18caf25ce978b4a40583b5b56b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e665b330b32c43ec07e1a48ba"`);
        await queryRunner.query(`DROP TABLE "practice_program_to_domain"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba35ffccfe64615402f5616032"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b9a9f5f1bc797af28de1e59fb"`);
        await queryRunner.query(`DROP TABLE "civic_center_service_to_domain"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d76b26c5aa965a54cb0db587b"`);
        await queryRunner.query(`DROP TABLE "user_history"`);
        await queryRunner.query(`DROP TYPE "public"."user_history_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_history_role_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_history_history_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_74e483638238b684d0c3513c6a"`);
        await queryRunner.query(`DROP TABLE "organization_request_history"`);
        await queryRunner.query(`DROP TYPE "public"."organization_request_history_history_action_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_request_history_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_504b4230bdbf8a1d69073fb8c0"`);
        await queryRunner.query(`DROP TABLE "organization_history"`);
        await queryRunner.query(`DROP TYPE "public"."organization_history_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_history_history_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_70dc4290ab037ad10639bfdb02"`);
        await queryRunner.query(`DROP TABLE "user_ong_application"`);
        await queryRunner.query(`DROP TYPE "public"."user_ong_application_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ef68e3c947f500128e31b4fd24"`);
        await queryRunner.query(`DROP TABLE "ong_application_history"`);
        await queryRunner.query(`DROP TYPE "public"."ong_application_history_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."ong_application_history_history_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4252f594dc488e5ef3f3ea515"`);
        await queryRunner.query(`DROP TABLE "application"`);
        await queryRunner.query(`DROP TYPE "public"."application_pulling_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."application_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."application_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3a4f4a6845acba124f15d1d60"`);
        await queryRunner.query(`DROP TABLE "ong_application"`);
        await queryRunner.query(`DROP TYPE "public"."ong_application_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fb66e0cb3462952d64ecabfc5d"`);
        await queryRunner.query(`DROP TABLE "application_history"`);
        await queryRunner.query(`DROP TYPE "public"."application_history_pulling_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."application_history_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."application_history_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."application_history_history_action_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_304665185f96a904be6fe42449"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71eac5c52a71a62e98911f36b8"`);
        await queryRunner.query(`DROP TABLE "_city"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_033fed1964b622afce113f2eff"`);
        await queryRunner.query(`DROP TABLE "investor"`);
        await queryRunner.query(`DROP TYPE "public"."investor_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7866f447fdab5ae6304b351d8e"`);
        await queryRunner.query(`DROP TABLE "organization_report"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4a468d6846865e29194b24f56a"`);
        await queryRunner.query(`DROP TABLE "report"`);
        await queryRunner.query(`DROP TYPE "public"."report_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cda306930dce3eb6252f68c5d7"`);
        await queryRunner.query(`DROP TABLE "partner"`);
        await queryRunner.query(`DROP TYPE "public"."partner_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_763748c108da399095b7ee5fcf"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TYPE "public"."organization_completion_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_77a80d92f561e285887f57a251"`);
        await queryRunner.query(`DROP TABLE "organization_request"`);
        await queryRunner.query(`DROP TYPE "public"."organization_request_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4f5f5fbda223ed5be534ce2a14"`);
        await queryRunner.query(`DROP TABLE "organization_legal"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bba17e00f3aa8a6d5f04ad650b"`);
        await queryRunner.query(`DROP TABLE "organization_general"`);
        await queryRunner.query(`DROP TYPE "public"."organization_general_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2b25c27e5af6d58024c9c824aa"`);
        await queryRunner.query(`DROP TABLE "organization_financial"`);
        await queryRunner.query(`DROP TYPE "public"."organization_financial_completion_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."organization_financial_financial_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a055035efc45463d0e0090314c"`);
        await queryRunner.query(`DROP TABLE "organization_activity"`);
        await queryRunner.query(`DROP TYPE "public"."organization_activity_area_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_773293fdd33ab67c6be087d6be"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1d2faa1fea637fe00d5eb05f56"`);
        await queryRunner.query(`DROP TABLE "practice_program"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_76a0d33c0d0d9854d477054148"`);
        await queryRunner.query(`DROP TABLE "civic_center_service"`);
        await queryRunner.query(`DROP TYPE "public"."civic_center_service_age_categories_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9d454fcad2648e52f56dcfc203"`);
        await queryRunner.query(`DROP TABLE "feedback"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d14a623c137986a8e9948edd5c"`);
        await queryRunner.query(`DROP TABLE "_skill"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_01403be9727760dfb75d42ed29"`);
        await queryRunner.query(`DROP TABLE "_faculty"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_dfacea4bae7c2a3ff281a5726b"`);
        await queryRunner.query(`DROP TABLE "_coalition"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c6e49847ab2f983f34252df395"`);
        await queryRunner.query(`DROP TABLE "_federation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1065d39d4b99a1110ac1d3da65"`);
        await queryRunner.query(`DROP TABLE "_domain"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8364fa95839cb74d16072d5654"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_806f2632bf2d7cbf69b408fb02"`);
        await queryRunner.query(`DROP TABLE "_county"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_2aeafa6b84ba955e8a46027875"`);
        await queryRunner.query(`DROP TABLE "_region"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ab34bcec3d684f98a87118e5bf"`);
        await queryRunner.query(`DROP TABLE "_contact"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_314d1dffdf6d12a86f7aca7051"`);
        await queryRunner.query(`DROP TABLE "public_keys"`);
    }

}
