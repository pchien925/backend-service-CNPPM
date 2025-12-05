import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1764776438514 implements MigrationInterface {
  name = 'Init1764776438514';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`tbl_tag\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`color\` varchar(50) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_group\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`kind\` int NOT NULL DEFAULT '0',
                \`description\` text NULL,
                \`is_system_role\` tinyint NOT NULL DEFAULT 0,
                UNIQUE INDEX \`IDX_876dc7f82f7298f9377cb8956c\` (\`name\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_permission\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`action\` varchar(255) NULL,
                \`show_menu\` tinyint NOT NULL DEFAULT 0,
                \`description\` text NULL,
                \`name_group\` varchar(255) NULL,
                \`p_code\` varchar(100) NOT NULL,
                UNIQUE INDEX \`IDX_efa2f8f4b8c180a9f663bf6195\` (\`name\`),
                UNIQUE INDEX \`IDX_7aec73c34c63f78f49b7a94db6\` (\`p_code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_account\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
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
                \`attempt_forget_pwd\` int NOT NULL DEFAULT '0',
                \`attempt_login\` int NOT NULL DEFAULT '0',
                \`is_super_admin\` tinyint NOT NULL DEFAULT 0,
                \`otp_code\` varchar(6) NULL,
                \`otp_expires_at\` timestamp NULL,
                \`group_id\` bigint UNSIGNED NULL,
                UNIQUE INDEX \`IDX_e757d08b9d52cef332b59c0411\` (\`username\`),
                UNIQUE INDEX \`IDX_a9cc0b1305ec441e60613b4981\` (\`email\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_nation\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`postal_code\` varchar(50) NULL,
                \`kind\` int NOT NULL COMMENT '1: ward, 2: district, 3: province' DEFAULT '1',
                \`parent_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_address\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`recipient_name\` varchar(255) NOT NULL,
                \`phone\` varchar(20) NOT NULL,
                \`address_line\` varchar(500) NOT NULL,
                \`is_default\` tinyint NOT NULL DEFAULT 0,
                \`account_id\` bigint UNSIGNED NULL,
                \`ward_id\` bigint UNSIGNED NULL,
                \`district_id\` bigint UNSIGNED NULL,
                \`province_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_branch\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`location\` varchar(500) NULL,
                \`phone\` varchar(20) NULL,
                \`image_url\` varchar(255) NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_order\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`code\` varchar(50) NOT NULL,
                \`type\` int NOT NULL COMMENT '1: pickup, 2: delivery' DEFAULT '1',
                \`sub_amount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`shipping_fee\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`order_status\` int NOT NULL COMMENT '1: pending, 2: success, 3: failed, 4: refunded' DEFAULT '1',
                \`payment_status\` int NOT NULL COMMENT '1: unpaid, 2: paid, 3: refunded' DEFAULT '1',
                \`note\` text NULL,
                \`cancel_at\` timestamp NULL,
                \`cancel_reason\` text NULL,
                \`account_id\` bigint UNSIGNED NULL,
                \`delivery_address_id\` bigint UNSIGNED NULL,
                \`branch_id\` bigint UNSIGNED NULL,
                UNIQUE INDEX \`IDX_7c8a165969a56f9cf15f919454\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_order_item\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`item_kind\` int NOT NULL COMMENT '1: food, 2: combo' DEFAULT '1',
                \`item_id\` bigint NOT NULL COMMENT 'ID of the Food or Combo',
                \`quantity\` int NOT NULL,
                \`base_price\` decimal(10, 2) NOT NULL,
                \`note\` text NULL,
                \`order_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_payment\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`refund_by\` varchar(255) NULL COMMENT 'User or system that initiated the refund',
                \`code\` varchar(50) NOT NULL,
                \`payment_method\` int NOT NULL COMMENT '1: cash, 2: transfer' DEFAULT '1',
                \`amount\` decimal(10, 2) NOT NULL,
                \`gateway_transaction_id\` varchar(255) NULL,
                \`gateway_response_json\` json NULL COMMENT 'Raw response data from payment gateway',
                \`paid_at\` timestamp NULL,
                \`refund_amount\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`refund_reason\` text NULL,
                \`refund_at\` timestamp NULL,
                \`order_id\` bigint UNSIGNED NULL,
                UNIQUE INDEX \`IDX_d27fb4bd27694e4df85533c8d5\` (\`code\`),
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_option\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_option_value\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`extra_price\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`ordering\` int NOT NULL DEFAULT '0',
                \`option_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_order_item_option\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`extra_price\` decimal(10, 2) NOT NULL COMMENT 'Extra price due to this option selection' DEFAULT '0.00',
                \`order_item_id\` bigint UNSIGNED NULL,
                \`option_value_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_category\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`kind\` int NOT NULL DEFAULT '0',
                \`image_url\` varchar(255) NULL,
                \`ordering\` int NOT NULL DEFAULT '0',
                \`parent_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_food\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`base_price\` decimal(10, 2) NOT NULL,
                \`image_url\` varchar(255) NULL,
                \`cooking_time\` int NULL COMMENT 'minutes',
                \`ordering\` int NOT NULL DEFAULT '0',
                \`category_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_order_item_combo_selection\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`extra_price\` decimal(10, 2) NOT NULL COMMENT 'Extra price due to selecting this specific food item in the combo group' DEFAULT '0.00',
                \`order_item_id\` bigint UNSIGNED NULL,
                \`selected_food_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_media\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`url\` varchar(500) NOT NULL,
                \`kind\` int NOT NULL COMMENT '1: image, 2: video, 3: pdf' DEFAULT '1',
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_media_relations\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`related_id\` bigint NOT NULL COMMENT 'ID of the related Entity (Food ID, Combo ID, etc.)',
                \`related_type\` varchar(255) NOT NULL COMMENT 'Name of the related Entity (e.g., Food, Combo)',
                \`ordering\` int NOT NULL DEFAULT '0',
                \`kind\` int NOT NULL COMMENT '1: main, 2: banner, 3: logo' DEFAULT '1',
                \`media_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_food_tag\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`food_id\` bigint UNSIGNED NULL,
                \`tag_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_food_option\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`ordering\` int NOT NULL DEFAULT '0',
                \`requirement_type\` int NOT NULL COMMENT '0: optional, 1: required' DEFAULT '1',
                \`max_select\` int NOT NULL DEFAULT '1',
                \`food_id\` bigint UNSIGNED NULL,
                \`option_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_combo\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`base_price\` decimal(10, 2) NOT NULL,
                \`image_url\` varchar(255) NULL,
                \`cooking_time\` int NULL,
                \`ordering\` int NOT NULL DEFAULT '0',
                \`category_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_combo_group\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`name\` varchar(255) NOT NULL,
                \`description\` text NULL,
                \`min_select\` int NOT NULL DEFAULT '0',
                \`max_select\` int NOT NULL DEFAULT '1',
                \`ordering\` int NOT NULL DEFAULT '0',
                \`combo_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_combo_tag\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`combo_id\` bigint UNSIGNED NULL,
                \`tag_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_combo_group_item\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`extra_price\` int NOT NULL DEFAULT '0',
                \`ordering\` int NOT NULL DEFAULT '0',
                \`combo_group_id\` bigint UNSIGNED NULL,
                \`food_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_cart\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`total_price\` decimal(10, 2) NOT NULL DEFAULT '0.00',
                \`account_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_cart_item\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`item_kind\` int NOT NULL COMMENT '1: food, 2: combo' DEFAULT '1',
                \`item_id\` bigint NOT NULL COMMENT 'ID of the Food or Combo',
                \`quantity\` int NOT NULL,
                \`base_price\` decimal(10, 2) NOT NULL,
                \`note\` text NULL,
                \`cart_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_cart_item_combo_selection\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`extra_price\` decimal(10, 2) NOT NULL COMMENT 'Extra price due to selecting this specific food item in the combo group' DEFAULT '0.00',
                \`cart_item_id\` bigint UNSIGNED NULL,
                \`selected_food_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_cart_item_option\` (
                \`created_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`created_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                \`modified_by\` varchar(50) NOT NULL DEFAULT 'admin',
                \`modified_date\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                \`status\` tinyint(1) NOT NULL DEFAULT '1',
                \`id\` bigint UNSIGNED NOT NULL,
                \`extra_price\` decimal(10, 2) NOT NULL COMMENT 'Extra price due to this option selection' DEFAULT '0.00',
                \`cart_item_id\` bigint UNSIGNED NULL,
                \`option_value_id\` bigint UNSIGNED NULL,
                PRIMARY KEY (\`id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            CREATE TABLE \`tbl_permission_group\` (
                \`group_id\` bigint UNSIGNED NOT NULL,
                \`permission_id\` bigint UNSIGNED NOT NULL,
                INDEX \`IDX_1ddc7e7b6daf85e6e2b1c9932b\` (\`group_id\`),
                INDEX \`IDX_54e0e3ae44911d34efd03d5bf8\` (\`permission_id\`),
                PRIMARY KEY (\`group_id\`, \`permission_id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_account\`
            ADD CONSTRAINT \`FK_d679aee1b8f57265b43db640a92\` FOREIGN KEY (\`group_id\`) REFERENCES \`tbl_group\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_nation\`
            ADD CONSTRAINT \`FK_bd1e60f172d4b00e60e6bf7b517\` FOREIGN KEY (\`parent_id\`) REFERENCES \`tbl_nation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\`
            ADD CONSTRAINT \`FK_c4cc222196259bdc306b8a04c56\` FOREIGN KEY (\`account_id\`) REFERENCES \`tbl_account\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\`
            ADD CONSTRAINT \`FK_11a73bdaf56ecd9fbd028c83ecf\` FOREIGN KEY (\`ward_id\`) REFERENCES \`tbl_nation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\`
            ADD CONSTRAINT \`FK_1585ce228956b30994c2ecbed38\` FOREIGN KEY (\`district_id\`) REFERENCES \`tbl_nation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\`
            ADD CONSTRAINT \`FK_cf264531d743754a4bdf1f6f875\` FOREIGN KEY (\`province_id\`) REFERENCES \`tbl_nation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order\`
            ADD CONSTRAINT \`FK_0b052b7313a6768cf0071db61a4\` FOREIGN KEY (\`account_id\`) REFERENCES \`tbl_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order\`
            ADD CONSTRAINT \`FK_1b9158807063978da99b9d1f362\` FOREIGN KEY (\`delivery_address_id\`) REFERENCES \`tbl_address\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order\`
            ADD CONSTRAINT \`FK_f83cded24ca85209b3ae8239dbe\` FOREIGN KEY (\`branch_id\`) REFERENCES \`tbl_branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item\`
            ADD CONSTRAINT \`FK_f407be67c81dd1a9c383c7d205c\` FOREIGN KEY (\`order_id\`) REFERENCES \`tbl_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_payment\`
            ADD CONSTRAINT \`FK_06fc1882eb95eae2fe7bfcde4ce\` FOREIGN KEY (\`order_id\`) REFERENCES \`tbl_order\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_option_value\`
            ADD CONSTRAINT \`FK_f34ad3981620a9628c37f7bc397\` FOREIGN KEY (\`option_id\`) REFERENCES \`tbl_option\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_option\`
            ADD CONSTRAINT \`FK_9fdca9d50384c9df5b8cedcadb4\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`tbl_order_item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_option\`
            ADD CONSTRAINT \`FK_d6cd217a367af7e7407bcb4dac1\` FOREIGN KEY (\`option_value_id\`) REFERENCES \`tbl_option_value\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_category\`
            ADD CONSTRAINT \`FK_c452c81a80811f601413f38813e\` FOREIGN KEY (\`parent_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food\`
            ADD CONSTRAINT \`FK_053dc3a06ebcb3866b225637b94\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_combo_selection\`
            ADD CONSTRAINT \`FK_b05f1b4e63a18deccf9a32bd874\` FOREIGN KEY (\`order_item_id\`) REFERENCES \`tbl_order_item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_combo_selection\`
            ADD CONSTRAINT \`FK_897e9b8976eeb1d4e0290b47b83\` FOREIGN KEY (\`selected_food_id\`) REFERENCES \`tbl_food\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_media_relations\`
            ADD CONSTRAINT \`FK_101a7f86243c3ab177d732f8eae\` FOREIGN KEY (\`media_id\`) REFERENCES \`tbl_media\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_tag\`
            ADD CONSTRAINT \`FK_ff7d35b2006e0f99e37d3e383b2\` FOREIGN KEY (\`food_id\`) REFERENCES \`tbl_food\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_tag\`
            ADD CONSTRAINT \`FK_c2f8f705b42a626ed648a3c39a7\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tbl_tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_option\`
            ADD CONSTRAINT \`FK_5099771eff47824f77aab80e274\` FOREIGN KEY (\`food_id\`) REFERENCES \`tbl_food\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_option\`
            ADD CONSTRAINT \`FK_0b85706db8dca8a19f80eee37d8\` FOREIGN KEY (\`option_id\`) REFERENCES \`tbl_option\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo\`
            ADD CONSTRAINT \`FK_a6caeb6516bc4f3ff418dd1174a\` FOREIGN KEY (\`category_id\`) REFERENCES \`tbl_category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_group\`
            ADD CONSTRAINT \`FK_22d94b30963ec3e0c1ae9d87072\` FOREIGN KEY (\`combo_id\`) REFERENCES \`tbl_combo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_tag\`
            ADD CONSTRAINT \`FK_1d996550cf9e57350d0f0f7f6c4\` FOREIGN KEY (\`combo_id\`) REFERENCES \`tbl_combo\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_tag\`
            ADD CONSTRAINT \`FK_c5c36f4b9bf9d64245bfcf1291f\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tbl_tag\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_group_item\`
            ADD CONSTRAINT \`FK_a8872327c51ee45baa8ed68faeb\` FOREIGN KEY (\`combo_group_id\`) REFERENCES \`tbl_combo_group\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_group_item\`
            ADD CONSTRAINT \`FK_55cc53efcd1c06be30cbc9fa767\` FOREIGN KEY (\`food_id\`) REFERENCES \`tbl_food\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart\`
            ADD CONSTRAINT \`FK_65c3591fc058ac1b80365f57918\` FOREIGN KEY (\`account_id\`) REFERENCES \`tbl_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item\`
            ADD CONSTRAINT \`FK_3c856940652316870466e415b54\` FOREIGN KEY (\`cart_id\`) REFERENCES \`tbl_cart\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_combo_selection\`
            ADD CONSTRAINT \`FK_c3ecfb4f16222d464b6750c64b2\` FOREIGN KEY (\`cart_item_id\`) REFERENCES \`tbl_cart_item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_combo_selection\`
            ADD CONSTRAINT \`FK_627da32b2421af503750505907d\` FOREIGN KEY (\`selected_food_id\`) REFERENCES \`tbl_food\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_option\`
            ADD CONSTRAINT \`FK_8a7efd9e6ea2265d80da6e31b96\` FOREIGN KEY (\`cart_item_id\`) REFERENCES \`tbl_cart_item\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_option\`
            ADD CONSTRAINT \`FK_5f608a9fcb34973ade553b6778a\` FOREIGN KEY (\`option_value_id\`) REFERENCES \`tbl_option_value\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_permission_group\`
            ADD CONSTRAINT \`FK_1ddc7e7b6daf85e6e2b1c9932b8\` FOREIGN KEY (\`group_id\`) REFERENCES \`tbl_group\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_permission_group\`
            ADD CONSTRAINT \`FK_54e0e3ae44911d34efd03d5bf86\` FOREIGN KEY (\`permission_id\`) REFERENCES \`tbl_permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
    await queryRunner.query(`
            ALTER TABLE \`tbl_permission_group\` DROP FOREIGN KEY \`FK_54e0e3ae44911d34efd03d5bf86\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_permission_group\` DROP FOREIGN KEY \`FK_1ddc7e7b6daf85e6e2b1c9932b8\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_option\` DROP FOREIGN KEY \`FK_5f608a9fcb34973ade553b6778a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_option\` DROP FOREIGN KEY \`FK_8a7efd9e6ea2265d80da6e31b96\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_combo_selection\` DROP FOREIGN KEY \`FK_627da32b2421af503750505907d\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item_combo_selection\` DROP FOREIGN KEY \`FK_c3ecfb4f16222d464b6750c64b2\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart_item\` DROP FOREIGN KEY \`FK_3c856940652316870466e415b54\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_cart\` DROP FOREIGN KEY \`FK_65c3591fc058ac1b80365f57918\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_group_item\` DROP FOREIGN KEY \`FK_55cc53efcd1c06be30cbc9fa767\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_group_item\` DROP FOREIGN KEY \`FK_a8872327c51ee45baa8ed68faeb\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_tag\` DROP FOREIGN KEY \`FK_c5c36f4b9bf9d64245bfcf1291f\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_tag\` DROP FOREIGN KEY \`FK_1d996550cf9e57350d0f0f7f6c4\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo_group\` DROP FOREIGN KEY \`FK_22d94b30963ec3e0c1ae9d87072\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_combo\` DROP FOREIGN KEY \`FK_a6caeb6516bc4f3ff418dd1174a\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_option\` DROP FOREIGN KEY \`FK_0b85706db8dca8a19f80eee37d8\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_option\` DROP FOREIGN KEY \`FK_5099771eff47824f77aab80e274\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_tag\` DROP FOREIGN KEY \`FK_c2f8f705b42a626ed648a3c39a7\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food_tag\` DROP FOREIGN KEY \`FK_ff7d35b2006e0f99e37d3e383b2\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_media_relations\` DROP FOREIGN KEY \`FK_101a7f86243c3ab177d732f8eae\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_combo_selection\` DROP FOREIGN KEY \`FK_897e9b8976eeb1d4e0290b47b83\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_combo_selection\` DROP FOREIGN KEY \`FK_b05f1b4e63a18deccf9a32bd874\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_food\` DROP FOREIGN KEY \`FK_053dc3a06ebcb3866b225637b94\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_category\` DROP FOREIGN KEY \`FK_c452c81a80811f601413f38813e\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_option\` DROP FOREIGN KEY \`FK_d6cd217a367af7e7407bcb4dac1\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item_option\` DROP FOREIGN KEY \`FK_9fdca9d50384c9df5b8cedcadb4\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_option_value\` DROP FOREIGN KEY \`FK_f34ad3981620a9628c37f7bc397\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_payment\` DROP FOREIGN KEY \`FK_06fc1882eb95eae2fe7bfcde4ce\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order_item\` DROP FOREIGN KEY \`FK_f407be67c81dd1a9c383c7d205c\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order\` DROP FOREIGN KEY \`FK_f83cded24ca85209b3ae8239dbe\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order\` DROP FOREIGN KEY \`FK_1b9158807063978da99b9d1f362\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_order\` DROP FOREIGN KEY \`FK_0b052b7313a6768cf0071db61a4\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\` DROP FOREIGN KEY \`FK_cf264531d743754a4bdf1f6f875\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\` DROP FOREIGN KEY \`FK_1585ce228956b30994c2ecbed38\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\` DROP FOREIGN KEY \`FK_11a73bdaf56ecd9fbd028c83ecf\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_address\` DROP FOREIGN KEY \`FK_c4cc222196259bdc306b8a04c56\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_nation\` DROP FOREIGN KEY \`FK_bd1e60f172d4b00e60e6bf7b517\`
        `);
    await queryRunner.query(`
            ALTER TABLE \`tbl_account\` DROP FOREIGN KEY \`FK_d679aee1b8f57265b43db640a92\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_54e0e3ae44911d34efd03d5bf8\` ON \`tbl_permission_group\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_1ddc7e7b6daf85e6e2b1c9932b\` ON \`tbl_permission_group\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_permission_group\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_cart_item_option\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_cart_item_combo_selection\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_cart_item\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_cart\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_combo_group_item\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_combo_tag\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_combo_group\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_combo\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_food_option\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_food_tag\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_media_relations\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_media\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_order_item_combo_selection\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_food\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_category\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_order_item_option\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_option_value\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_option\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_d27fb4bd27694e4df85533c8d5\` ON \`tbl_payment\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_payment\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_order_item\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_7c8a165969a56f9cf15f919454\` ON \`tbl_order\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_order\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_branch\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_address\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_nation\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_a9cc0b1305ec441e60613b4981\` ON \`tbl_account\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_e757d08b9d52cef332b59c0411\` ON \`tbl_account\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_account\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_7aec73c34c63f78f49b7a94db6\` ON \`tbl_permission\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_efa2f8f4b8c180a9f663bf6195\` ON \`tbl_permission\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_permission\`
        `);
    await queryRunner.query(`
            DROP INDEX \`IDX_876dc7f82f7298f9377cb8956c\` ON \`tbl_group\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_group\`
        `);
    await queryRunner.query(`
            DROP TABLE \`tbl_tag\`
        `);
  }
}
