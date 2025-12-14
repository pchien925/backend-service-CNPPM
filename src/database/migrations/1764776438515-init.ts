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
            (6778614941024286, 'Delete Option', '/v1/options/:id', 'Soft delete an item option (set status = -2)', 'Option Management', 0, 'OPT_D', 1, 'Admin', NOW(), 'Admin', NOW()),

            (6778614941024287, 'Create Option Value', '/v1/options/:id/values', 'Create a new value for an option (e.g., Small, Medium)', 'Option Value Management', 0, 'OPV_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024288, 'List Option Values', '/v1/options/:id/values', 'Get list of values for a specific option', 'Option Value Management', 0, 'OPV_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024289, 'Get Option Value detail', '/v1/option-values/:id', 'Get detail of a specific option value', 'Option Value Management', 0, 'OPV_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024290, 'Update Option Value', '/v1/option-values/:id', 'Update option value details or status', 'Option Value Management', 0, 'OPV_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024291, 'Delete Option Value', '/v1/option-values/:id', 'Soft delete an option value (set status = -2)', 'Option Value Management', 0, 'OPV_D', 1, 'Admin', NOW(), 'Admin', NOW()),
            
            (6778614941024292, 'Create Category', '/v1/categories/create', 'Create a new category', 'Category Management', 0, 'CAT_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024293, 'List Categories', '/v1/categories/list', 'Get list of all categories', 'Category Management', 1, 'CAT_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024294, 'Get Category detail', '/v1/categories/:id', 'Get detail of a specific category', 'Category Management', 0, 'CAT_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024295, 'Update Category', '/v1/categories/update', 'Update category details or status', 'Category Management', 0, 'CAT_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024296, 'Delete Category', '/v1/categories/:id', 'Soft delete a category (set status = -2, applies to children)', 'Category Management', 0, 'CAT_D', 1, 'Admin', NOW(), 'Admin', NOW()),
            
            (6778614941024297, 'Create Tag', '/v1/tags/create', 'Create a new tag', 'Tag Management', 0, 'TAG_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024298, 'List Tags', '/v1/tags/list', 'Get list of all tags', 'Tag Management', 1, 'TAG_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024299, 'Get Tag detail', '/v1/tags/:id', 'Get detail of a specific tag', 'Tag Management', 0, 'TAG_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024300, 'Update Tag', '/v1/tags/update', 'Update tag details or status', 'Tag Management', 0, 'TAG_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024301, 'Delete Tag', '/v1/tags/:id', 'Soft delete a tag (set status = -2)', 'Tag Management', 0, 'TAG_D', 1, 'Admin', NOW(), 'Admin', NOW()),

            (6778614941024302, 'Create Food', '/v1/foods/create', 'Create a new food item with options and tags', 'Food Management', 0, 'FOOD_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024303, 'List Foods', '/v1/foods/list', 'Get list of all food items with filtering/pagination', 'Food Management', 1, 'FOOD_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024304, 'Get Food detail', '/v1/foods/:id', 'Get detail of a specific food item', 'Food Management', 0, 'FOOD_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024305, 'Update Food', '/v1/foods/update', 'Update food item details, options, or tags', 'Food Management', 0, 'FOOD_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024306, 'Delete Food', '/v1/foods/:id', 'Soft delete a food item (set status = -2)', 'Food Management', 0, 'FOOD_D', 1, 'Admin', NOW(), 'Admin', NOW()),

            (6778614941024307, 'Create Combo', '/v1/combos/create', 'Create a new combo package', 'Combo Management', 0, 'COM_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024308, 'List Combos', '/v1/combos/list', 'Get list of all combos with filtering/pagination', 'Combo Management', 1, 'COM_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024309, 'Get Combo detail', '/v1/combos/:id', 'Get detail of a specific combo', 'Combo Management', 0, 'COM_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024310, 'Update Combo', '/v1/combos/update', 'Update combo details, groups, or tags', 'Combo Management', 0, 'COM_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024311, 'Delete Combo', '/v1/combos/:id', 'Soft delete a combo (set status = -2)', 'Combo Management', 0, 'COM_D', 1, 'Admin', NOW(), 'Admin', NOW()),

            (6778614941024312, 'Create Combo Group', '/v1/combo-groups/create', 'Create a selection group within a combo', 'Combo Group Management', 0, 'COM_GR_C', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024313, 'List Combo Groups', '/v1/combo-groups/list', 'Get list of all groups for a combo', 'Combo Group Management', 0, 'COM_GR_L', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024314, 'Get Combo Group detail', '/v1/combo-groups/:id', 'Get detail of a specific combo group', 'Combo Group Management', 0, 'COM_GR_V', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024315, 'Update Combo Group', '/v1/combo-groups/update', 'Update combo group details or items', 'Combo Group Management', 0, 'COM_GR_U', 1, 'Admin', NOW(), 'Admin', NOW()),
            (6778614941024316, 'Delete Combo Group', '/v1/combo-groups/:id', 'Soft delete a combo group (set status = -2)', 'Combo Group Management', 0, 'COM_GR_D', 1, 'Admin', NOW(), 'Admin', NOW());
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
            (15, 6778614941024306),
            
            (15, 6778614941024307),
            (15, 6778614941024308),
            (15, 6778614941024309),
            (15, 6778614941024310),
            (15, 6778614941024311),

            (15, 6778614941024312),
            (15, 6778614941024313),
            (15, 6778614941024314),
            (15, 6778614941024315),
            (15, 6778614941024316);
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const permissionIds = [
      // Option
      6778614941024282, 6778614941024283, 6778614941024284, 6778614941024285, 6778614941024286,
      // Option Value Permissions
      6778614941024287, 6778614941024288, 6778614941024289, 6778614941024290, 6778614941024291,
      // Category Permissions
      6778614941024292, 6778614941024293, 6778614941024294, 6778614941024295, 6778614941024296,
      // Tag Permissions
      6778614941024297, 6778614941024298, 6778614941024299, 6778614941024300, 6778614941024301,
      // Food Permissions
      6778614941024302, 6778614941024303, 6778614941024304, 6778614941024305, 6778614941024306,
      // Combo Permissions
      6778614941024307, 6778614941024308, 6778614941024309, 6778614941024310, 6778614941024311,
      // Combo Group Permissions
      6778614941024312, 6778614941024313, 6778614941024314, 6778614941024315, 6778614941024316,
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
