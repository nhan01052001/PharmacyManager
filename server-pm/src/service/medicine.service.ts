import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ErrorResponse } from "../error/error-response.error";
import { SelectQueryBuilder } from "typeorm";
import { entities } from "../entities.provider";

@Injectable({})
export class MedicinesService {
    constructor(

        // @InjectRepository(provinces)
        // private provincesRepository: ProvincesRepository,

    ) { }

}