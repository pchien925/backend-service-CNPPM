import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1764776438515 implements MigrationInterface {
  name = 'Init1764776438515';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            INSERT INTO \`tbl_permission\` (\`id\`, \`name\`, \`action\`, \`description\`, \`name_group\`, \`show_menu\`, \`p_code\`, \`status\`, \`created_by\`, \`created_date\`, \`modified_by\`, \`modified_date\`) VALUES
            (6778614941024282, 'Create Option', '/v1/options', 'Create a new item option (e.g., Size, Topping)', 'Option Management', 0, 'OPT_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024283, 'List Option', '/v1/options', 'Get list of all item options', 'Option Management', 1, 'OPT_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024284, 'Get Option detail', '/v1/options/:id', 'Get detail of a specific option', 'Option Management', 0, 'OPT_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024285, 'Update Option', '/v1/options/:id', 'Update option details or status', 'Option Management', 0, 'OPT_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024286, 'Delete Option', '/v1/options/:id', 'Soft delete an item option (set status = 0)', 'Option Management', 0, 'OPT_D', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024287, 'Create Option Value', '/v1/options/:id/values', 'Create a new value for an option (e.g., Small, Medium)', 'Option Value Management', 0, 'OPV_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024288, 'List Option Values', '/v1/options/:id/values', 'Get list of values for a specific option', 'Option Value Management', 0, 'OPV_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024289, 'Get Option Value detail', '/v1/option-values/:id', 'Get detail of a specific option value', 'Option Value Management', 0, 'OPV_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024290, 'Update Option Value', '/v1/option-values/:id', 'Update option value details or status', 'Option Value Management', 0, 'OPV_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024291, 'Delete Option Value', '/v1/option-values/:id', 'Soft delete an option value (set status = 0)', 'Option Value Management', 0, 'OPV_D', 1, 'Admin', NOW(), 'Admin', NOW()),
            
            (6778614941024292, 'Create Category', '/v1/categories/create', 'Create a new category', 'Category Management', 0, 'CAT_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024293, 'List Categories', '/v1/categories/list', 'Get list of all categories', 'Category Management', 1, 'CAT_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024294, 'Get Category detail', '/v1/categories/:id', 'Get detail of a specific category', 'Category Management', 0, 'CAT_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024295, 'Update Category', '/v1/categories/update', 'Update category details or status', 'Category Management', 0, 'CAT_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024296, 'Delete Category', '/v1/categories/:id', 'Soft delete a category (set status = 0, applies to children)', 'Category Management', 0, 'CAT_D', 1, 'Admin', NOW(), 'Admin', NOW()),
            
            (6778614941024297, 'Create Tag', '/v1/tags/create', 'Create a new tag', 'Tag Management', 0, 'TAG_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024298, 'List Tags', '/v1/tags/list', 'Get list of all tags', 'Tag Management', 1, 'TAG_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024299, 'Get Tag detail', '/v1/tags/:id', 'Get detail of a specific tag', 'Tag Management', 0, 'TAG_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024300, 'Update Tag', '/v1/tags/update', 'Update tag details or status', 'Tag Management', 0, 'TAG_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024301, 'Delete Tag', '/v1/tags/:id', 'Soft delete a tag (set status = 0)', 'Tag Management', 0, 'TAG_D', 1, 'Admin', NOW(), 'Admin', NOW()),

            (6778614941024302, 'Create Food', '/v1/foods', 'Create a new food item with options and tags', 'Food Management', 0, 'FOOD_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024303, 'List Foods', '/v1/foods', 'Get list of all food items with filtering/pagination', 'Food Management', 1, 'FOOD_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024304, 'Get Food detail', '/v1/foods/:id', 'Get detail of a specific food item', 'Food Management', 0, 'FOOD_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024305, 'Update Food', '/v1/foods', 'Update food item details, options, or tags', 'Food Management', 0, 'FOOD_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024306, 'Delete Food', '/v1/foods/:id', 'Soft delete a food item (set status = -2)', 'Food Management', 0, 'FOOD_D', 1, 'Admin', NOW(), 'Admin', NOW());
        `);
    await queryRunner.query(`
            INSERT INTO \`tbl_permission_group\` (\`group_id\`, \`permission_id\`) VALUES
            (15, 6778614941024282),
            (15, 6778614941024283),
            (15, 6778614941024284),
            (15, 6778614941024285),
            (15, 6778614941024286),
            (15, 6778614941024287),
            (15, 6778614941024288),
            (15, 6778614941024289),
            (15, 6778614941024290),
            (15, 6778614941024291),
            
            (15, 6778614941024292),
            (15, 6778614941024293),
            (15, 6778614941024294),
            (15, 6778614941024295),
            (15, 6778614941024296),

            (15, 6778614941024297),
            (15, 6778614941024298),
            (15, 6778614941024299),
            (15, 6778614941024300),
            (15, 6778614941024301),

            (15, 6778614941024302),
            (15, 6778614941024303),
            (15, 6778614941024304),
            (15, 6778614941024305),
            (15, 6778614941024306);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissionIds = [
      // Option & Option Value
      6778614941024282, 6778614941024283, 6778614941024284, 6778614941024285, 6778614941024286,
      6778614941024287, 6778614941024288, 6778614941024289, 6778614941024290, 6778614941024291,
      // Category Permissions
      6778614941024292, 6778614941024293, 6778614941024294, 6778614941024295, 6778614941024296,
      // Tag Permissions
      6778614941024297, 6778614941024298, 6778614941024299, 6778614941024300, 6778614941024301,
      // Food Permissions
      6778614941024302, 6778614941024303, 6778614941024304, 6778614941024305, 6778614941024306,
    ];

    const idList = permissionIds.join(',');

    await queryRunner.query(`
                DELETE FROM \`tbl_permission_group\` 
                WHERE \`permission_id\` IN (${idList}) AND \`group_id\` = 15;
            `);

    await queryRunner.query(`
                DELETE FROM \`tbl_permission\` 
                WHERE \`id\` IN (${idList});
            `);
  }
}
