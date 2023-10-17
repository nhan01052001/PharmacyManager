import { Controller, Post, Req, Body, Get, Param, Headers } from "@nestjs/common";

import { ProvincesService } from "../service/provinces.service";

@Controller('provinces')
export class ProvincesController {
    constructor(
        private provincesService: ProvincesService
    ){}

    @Get('/getAllProvinces')
    getAllProvinces(@Headers() headers: any): Promise<unknown> {
        return this.provincesService.getAllProvinces(headers);
    }

}