import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOtpFields1731500000000 implements MigrationInterface {
  name = 'AddOtpFields1731500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`tbl_account\` 
      ADD \`email_verified\` tinyint NOT NULL DEFAULT 0
    `);

    await queryRunner.query(`
      ALTER TABLE \`tbl_account\` 
      ADD \`otp_code\` varchar(6) NULL
    `);

    await queryRunner.query(`
      ALTER TABLE \`tbl_account\` 
      ADD \`otp_expires_at\` timestamp NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE \`tbl_account\` 
      DROP COLUMN \`otp_expires_at\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`tbl_account\` 
      DROP COLUMN \`otp_code\`
    `);

    await queryRunner.query(`
      ALTER TABLE \`tbl_account\` 
      DROP COLUMN \`email_verified\`
    `);
  }
}
