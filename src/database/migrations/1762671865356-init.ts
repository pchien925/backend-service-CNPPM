import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1762671865356 implements MigrationInterface {
  name = 'Init1762671865356';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`tbl_group\` (
                \`created_by\` varchar(50) NOT NULL,
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL,
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint NOT NULL DEFAULT 1,
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`kind\` int NULL,
                \`description\` text NULL,
                \`is_system_role\` tinyint NOT NULL DEFAULT 0,
                UNIQUE INDEX \`IDX_GROUP_NAME\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE \`tbl_permission\` (
                \`created_by\` varchar(50) NOT NULL,
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL,
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint NOT NULL DEFAULT 1,
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`action\` varchar(255) NULL,
                \`show_menu\` tinyint NOT NULL DEFAULT 0,
                \`description\` text NULL,
                \`name_group\` varchar(255) NULL,
                \`p_code\` varchar(100) NOT NULL,
                UNIQUE INDEX \`IDX_PERMISSION_NAME\` (\`name\`),
                UNIQUE INDEX \`IDX_PERMISSION_P_CODE\` (\`p_code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE \`tbl_account\` (
                \`created_by\` varchar(50) NOT NULL,
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL,
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint NOT NULL DEFAULT 1,
                \`id\` bigint UNSIGNED NOT NULL,
                \`kind\` int NOT NULL,
                \`username\` varchar(255) NOT NULL,
                \`phone\` varchar(20) NULL,
                \`email\` varchar(255) NOT NULL,
                \`password\` varchar(255) NOT NULL,
                \`full_name\` varchar(255) NOT NULL,
                \`last_login\` timestamp NULL,
                \`avatar_path\` varchar(255) NULL,
                \`reset_pwd_code\` varchar(255) NULL,
                \`reset_pwd_time\` timestamp NULL,
                \`attempt_forget_pwd\` int NOT NULL DEFAULT 0,
                \`attempt_login\` int NOT NULL DEFAULT 0,
                \`is_super_admin\` tinyint NOT NULL DEFAULT 0,
                \`group_id\` bigint UNSIGNED NULL,
                UNIQUE INDEX \`IDX_ACCOUNT_USERNAME\` (\`username\`),
                UNIQUE INDEX \`IDX_ACCOUNT_EMAIL\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);

    await queryRunner.query(`
            CREATE TABLE \`tbl_permission_group\` (
                \`group_id\` bigint UNSIGNED NOT NULL,
                \`permission_id\` bigint UNSIGNED NOT NULL,
                INDEX \`IDX_PERMISSION_GROUP_GROUP_ID\` (\`group_id\`),
                INDEX \`IDX_PERMISSION_GROUP_PERMISSION_ID\` (\`permission_id\`),
                PRIMARY KEY (\`group_id\`, \`permission_id\`)
            ) ENGINE = InnoDB
        `);

    await queryRunner.query(`
            ALTER TABLE \`tbl_account\`
            ADD CONSTRAINT \`FK_ACCOUNT_GROUP\` FOREIGN KEY (\`group_id\`) REFERENCES \`tbl_group\`(\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE \`tbl_permission_group\`
            ADD CONSTRAINT \`FK_PERMISSION_GROUP_GROUP\` FOREIGN KEY (\`group_id\`) REFERENCES \`tbl_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE \`tbl_permission_group\`
            ADD CONSTRAINT \`FK_PERMISSION_GROUP_PERMISSION\` FOREIGN KEY (\`permission_id\`) REFERENCES \`tbl_permission\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);

    await queryRunner.query(`
            INSERT INTO \`tbl_group\` (\`id\`, \`name\`, \`description\`, \`kind\`, \`is_system_role\`, \`status\`, \`created_by\`, \`created_date\`, \`modified_by\`, \`modified_date\`) VALUES
            (15, 'ROLE ADMIN', 'Role for administrator', 1, 0, 1, 'Admin', '2020-06-24 07:33:00', 'admin', '2023-04-10 06:47:43'),
            (16, 'ROLE MANAGER', 'Role for manager account', 2, 0, 1, 'Admin', '2020-06-24 08:21:54', 'admin', '2023-06-28 16:22:25');
        `);

    await queryRunner.query(`
            INSERT INTO \`tbl_permission\` (\`id\`, \`name\`, \`action\`, \`description\`, \`name_group\`, \`show_menu\`, \`p_code\`, \`status\`, \`created_by\`, \`created_date\`, \`modified_by\`, \`modified_date\`) VALUES
            (6778614941024257, 'Create account', '/v1/account/create', 'Create account', 'Account', 0, 'ACC_C', 1, 'Admin', '2020-06-24 02:14:55', 'Admin', '2020-06-24 02:14:55'),
            (6778614941024258, 'Get account detail', '/v1/account/get', 'Get account detail bold customer and admin', 'Account', 0, 'ACC_V', 1, 'Admin', '2020-06-24 02:19:16', 'Admin', '2020-06-24 02:19:16'),
            (6778614941024259, 'Get list account', '/v1/account/list', 'Get list account both customer and admin', 'Account', 1, 'ACC_L', 1, 'Admin', '2020-06-24 02:21:13', 'Admin', '2020-06-24 02:21:13'),
            (6778614941024260, 'Delete an account', '/v1/account/delete', 'Delete account both customer and admin', 'Account', 0, 'ACC_D', 1, 'Admin', '2020-06-24 02:21:34', 'Admin', '2020-06-24 02:21:34'),
            (6778614941024261, 'Create admin account', '/v1/account/create_admin', 'Create an admin account', 'Account', 0, 'ACC_C_AD', 1, 'Admin', '2020-06-24 02:24:17', 'Admin', '2020-06-24 02:24:17'),
            (6778614941024262, 'Update a profile admin', '/v1/account/update_profile_admin', 'Update a profile admin', 'Account', 0, 'ACC_U_PROFILE_AD', 1, 'Admin', '2020-06-24 05:08:15', 'Admin', '2020-06-24 05:08:15'),
            (6778614941024263, 'Update a admin account', '/v1/account/update_admin', 'Update a admin account', 'Account', 0, 'ACC_U_AD', 1, 'Admin', '2020-06-24 05:09:14', 'Admin', '2020-06-24 05:09:14'),
            (6778614941024270, 'Upload file', '/v1/file/upload', 'Upload file', 'file', 0, 'FILE_U', 1, 'admin', '2022-09-21 04:34:33', 'admin', '2022-09-21 04:34:33'),
            (6778614941024271, 'Create group permission', '/v1/group/create', 'Create a group', 'Permission', 0, 'GR_C', 1, 'Admin', '2020-06-24 04:57:08', 'Admin', '2020-06-24 04:57:08'),
            (6778614941024272, 'Get detail group permission', '/v1/group/get', 'Get detail a group permission', 'Permission', 0, 'GR_V', 1, 'Admin', '2020-06-24 04:57:34', 'Admin', '2020-06-24 04:57:34'),
            (6778614941024273, 'Get list group permission', '/v1/group/list', 'Get list group permission', 'Permission', 0, 'GR_L', 1, 'Admin', '2020-06-24 04:58:00', 'Admin', '2020-06-24 04:58:00'),
            (6778614941024274, 'Update a group permission', '/v1/group/update', 'Update a group permission', 'Permission', 0, 'GR_U', 1, 'Admin', '2020-06-24 04:58:21', 'Admin', '2020-06-24 04:58:21'),
            (6778614941024275, 'Delete a group permission', '/v1/group/delete', 'Delete a group permission', 'Permission', 0, 'GR_D', 1, 'Admin', '2020-06-24 04:58:21', 'Admin', '2020-06-24 04:58:21'),
            (6778614941024280, 'List permission', '/v1/permission/list', 'List permission', 'Permission', 0, 'PER_L', 1, 'Admin', '2020-09-13 04:48:58', 'Admin', '2020-09-13 04:48:58'),
            (6778614941024281, 'Create permission', '/v1/permission/create', 'Create permission', 'Permission', 0, 'PER_C', 1, 'Admin', '2020-09-13 04:49:13', 'Admin', '2020-09-13 04:49:13');
        `);

    await queryRunner.query(`
            INSERT INTO \`tbl_account\` (\`id\`, \`kind\`, \`username\`, \`email\`, \`password\`, \`full_name\`, \`last_login\`, \`avatar_path\`, \`reset_pwd_code\`, \`reset_pwd_time\`, \`attempt_forget_pwd\`, \`is_super_admin\`, \`group_id\`, \`status\`, \`created_by\`, \`created_date\`, \`modified_by\`, \`modified_date\`, \`phone\`) VALUES
            (2, 1, 'admin', 'pchien925@gmail.com', '$2b$10$VtWZrXfMIs.R4W/z/J9/5OgaPlRVbSKHz6lLV0Ayf0qzf1auY8YRS', 'Super Admin', '2023-03-27 03:52:17', NULL, '0622', '2021-03-11 17:16:26', 0, 1, 15, 1, 'Admin', '2020-06-24 00:22:30', 'admin', '2023-04-16 14:52:55', '0979859559');
        `);
    //$2b$10$VtWZrXfMIs.R4W/z/J9/5OgaPlRVbSKHz6lLV0Ayf0qzf1auY8YRS - 123456

    await queryRunner.query(`
            INSERT INTO \`tbl_permission_group\` (\`group_id\`, \`permission_id\`) VALUES
            (15, 6778614941024257),
            (15, 6778614941024258),
            (15, 6778614941024259),
            (15, 6778614941024260),
            (15, 6778614941024261),
            (15, 6778614941024262),
            (15, 6778614941024263),
            (15, 6778614941024270),
            (15, 6778614941024271),
            (15, 6778614941024272),
            (15, 6778614941024273),
            (15, 6778614941024274),
            (15, 6778614941024275),
            (15, 6778614941024280),
            (15, 6778614941024281);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`tbl_permission_group\` DROP FOREIGN KEY \`FK_PERMISSION_GROUP_PERMISSION\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`tbl_permission_group\` DROP FOREIGN KEY \`FK_PERMISSION_GROUP_GROUP\``,
    );
    await queryRunner.query(`ALTER TABLE \`tbl_account\` DROP FOREIGN KEY \`FK_ACCOUNT_GROUP\``);

    await queryRunner.query(`DROP TABLE \`tbl_permission_group\``);
    await queryRunner.query(`DROP TABLE \`tbl_account\``);
    await queryRunner.query(`DROP TABLE \`tbl_permission\``);
    await queryRunner.query(`DROP TABLE \`tbl_group\``);
  }
}
