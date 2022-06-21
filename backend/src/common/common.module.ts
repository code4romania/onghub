import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Contact } from './entities/contact.entity';
import { County } from './entities/county.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, County, Contact])],
})
export class CommonModule {}
