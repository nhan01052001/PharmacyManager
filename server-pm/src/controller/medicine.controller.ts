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

    @Post('/updateOneMedicine')
    updateOneMedicine(@Headers() headers: any, @Body() body?: MedicinesDTO, value?: any): Promise<unknown> {
        return this.medicinesService.updateOneMedicine(headers, body, value);
    }

    @Post('/deleteMedicine')
    deleteMedicine(@Body() body?: any): Promise<unknown> {
        return this.medicinesService.deleteMedicine(body);
    }

    @Post('/revertDeleteMedicine')
    revertDeleteMedicine(@Body() body?: any): Promise<unknown> {
        return this.medicinesService.revertDeleteMedicine(body);
    }

    @Get('/getMedicineById/:id')
    getMedicineById(@Param() param: any): Promise<unknown> {
        return this.medicinesService.getMedicineById(param?.id);
    }

    @Get('/findMedicine/')
    findMedicine(@Headers() headers: any, @Query("typeFind") typeFind: string, @Query("search") search?: string): Promise<unknown> {
        return this.medicinesService.findMedicine(headers, search, typeFind );
    }
}