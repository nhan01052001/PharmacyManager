import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../entities.provider';
import { CartController } from '../controller/cart.controller';
import { CartService } from '../service/cart.service';

@Module({
    imports: [TypeOrmModule.forFeature(entities)],
    controllers: [CartController],
    providers: [CartService],
    exports: [CartService]
})
export class CartModule {}
