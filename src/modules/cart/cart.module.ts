import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartService } from './cart.service';

import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CartItemOption } from './entities/cart-item-option.entity';
import { CartItemComboSelection } from './entities/cart-item-combo-selection.entity';
import { Food } from 'src/modules/food/entities/food.entity';
import { Combo } from 'src/modules/combo/entities/combo.entity';
import { OptionValue } from 'src/modules/option/entities/option-value.entity';
import { ComboGroupItem } from 'src/modules/combo/entities/combo-group-item.entity';
import { CartController } from './cart.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Cart,
      CartItem,
      CartItemOption,
      CartItemComboSelection,
      Food,
      Combo,
      OptionValue,
      ComboGroupItem,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
