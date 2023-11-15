import { Module } from "@nestjs/common";
import { MedicinesController } from "../controller/medicine.controller";
import { MedicinesService } from "../service/medicine.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../entities.provider";
import { MedicineRepository } from "../repository/medicines.repository";

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature(entities)],
    controllers: [
        MedicinesController
    ],
    providers: [
        MedicinesService,
    ],
    exports: [MedicinesService]
})

export class MedicineModule {}