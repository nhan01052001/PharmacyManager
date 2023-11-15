import { Controller, Post, Req, Body, Get, Param, Headers, Query } from "@nestjs/common";

import { MedicinesService } from "../service/medicine.service";
import { MedicineDTO, MedicinesDTO } from "../validator/dto/medicine.dto";

@Controller('medicine')
export class MedicinesController {
    constructor(
        private medicinesService: MedicinesService
    ) { }

    
    @Post('/addMedicines')
    addMedicines(@Headers() headers: any, @Body() body?: MedicinesDTO): Promise<unknown> {
        return this.medicinesService.addMedicines(headers, body);
    }
    
    @Get('/getMedicineByCode/:code')
    getMedicineByCode(@Param() param: any): Promise<unknown> {
        return this.medicinesService.getMedicineByCode(param?.code);
    }
}