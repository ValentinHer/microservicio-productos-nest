import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot({isGlobal: true}), DatabaseModule, ProductModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
