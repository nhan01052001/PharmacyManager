import { Module } from "@nestjs/common";
import { MedicinesController } from "../controller/medicine.controller";
import { MedicinesService } from "../service/medicine.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../entities.provider";
import { ProvincesService } from "../service/provinces.service";
import { UserService } from "../service/user.service";
import { CartService } from "../service/cart.service";

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature(entities)],
    controllers: [
        MedicinesController
    ],
    providers: [
        MedicinesService,
        ProvincesService,
        UserService,
        CartService
    ],
    exports: [MedicinesService]
})

export class MedicineModule {}