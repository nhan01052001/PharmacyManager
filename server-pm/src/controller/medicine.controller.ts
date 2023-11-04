import { Controller, Post, Req, Body, Get, Param, Headers, Query } from "@nestjs/common";

import { MedicinesService } from "../service/medicine.service";

@Controller('medicine')
export class MedicinesController {
    constructor(
        private medicinesService: MedicinesService
    ) { }

    

}