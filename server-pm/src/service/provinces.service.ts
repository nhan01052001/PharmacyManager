import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ProvincesRepository } from "../repository/provinces.repository";
import { provinces } from "../entity/provinces.entity";
import { ErrorResponse } from "../error/error-response.error";

@Injectable({})
export class ProvincesService {
    constructor(

        @InjectRepository(provinces)
        private provincesRepository: ProvincesRepository,

    ) { }

    async getAllProvinces(headers: any): Promise<unknown> {
        try {
            const result = await this.provincesRepository.find({take: 1, skip: 1});
                if(result) {
                    return {
                        statusCode: 200,
                        statusText: 'SUCCESS',
                        message: 'Thành công!',
                        data: result
                    }
                } else {
                    return {
                        statusCode: 200,
                        statusText: 'EMPTY',
                        message: 'Không có dữ liệu!',
                        data: result
                    }
                }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }
}