import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'thirdservice',
            password: process.env.DB_PASSWORD || 'thirdservice',
            database: process.env.DB_NAME || 'db_third_service',
            entities: [Product],
            synchronize: true
        })
    ]
})
export class DatabaseModule {}
