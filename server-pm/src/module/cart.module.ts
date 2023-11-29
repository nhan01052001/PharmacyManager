import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../entities.provider';
import { CartController } from '../controller/cart.controller';
import { CartService } from '../service/cart.service';
import { AuthModule } from './auth.module';
import { MedicinesService } from '../service/medicine.service';

@Module({
    imports: [TypeOrmModule.forFeature(entities), AuthModule],
    controllers: [CartController],
    providers: [CartService, MedicinesService],
    exports: [CartService]
})
export class CartModule {}
