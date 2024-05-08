import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from '../entities.provider';
import { AuthModule } from './auth.module';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { CartService } from '../service/cart.service';
import { BillService } from '../service/bill.service';

@Module({
    imports: [TypeOrmModule.forFeature(entities), AuthModule],
    controllers: [UserController],
    providers: [UserService, CartService, BillService],
    exports: [UserService]
})
export class UserModule {}
