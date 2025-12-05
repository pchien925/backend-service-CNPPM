import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OptionValue } from './entities/option-value.entity';
import { OptionValueController } from './option-value.controller';
import { OptionValueService } from './option-value.service';
import { Option } from './entities/option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OptionValue, Option])],
  providers: [OptionValueService],
  controllers: [OptionValueController],
})
export class OptionValueModule {}
