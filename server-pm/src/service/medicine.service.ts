import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ErrorResponse } from "../error/error-response.error";
import { ILike, SelectQueryBuilder } from "typeorm";
import { entities } from "../entities.provider";
import { MedicineRepository } from "../repository/medicines.repository";
import { Medicine } from "../entity/medicine.entity";
import { MedicineDTO, MedicinesDTO } from "../validator/dto/medicine.dto";
import Function from "../util/function.util";

@Injectable()
export class MedicinesService {
    constructor(

        @InjectRepository(Medicine)
        private readonly medicineRepository: MedicineRepository,

    ) { }

    async addMedicines(headers: any, medicines?: MedicinesDTO): Promise<unknown> {
        try {
            if (medicines) {

                let medicine = null;
                if (medicines.medicines.length > 1) {
                    //medicine = await this.medicineRepository.createQueryBuilder().insert().into('Medicine').values([...medicines.medicines]).execute();
                    medicine = await this.medicineRepository.save([...medicines.medicines]);
                    console.log(medicine, 'medicine');
                    
                } else {
                    const keyValue = { ...medicines.medicines[0] };
                    const valueMedicineDetail = { ...medicines.medicines[0].medicineDetail }
                    const keyValueMedicineDetail = Object.keys(keyValue.medicineDetail).map((item) => {
                        return `MedicineDetail.${item}`;
                    });
                    delete keyValue.medicineDetail;
                    const keyValueMedicine = Object.keys(keyValue).map((item) => {
                        return `Medicine.${item}`;
                    });
                    // if have medicine before, just update again ...medicines.medicines[0]
                    const resultMedicine = await this.getMedicineByCode(medicines.medicines[0].code, `${keyValueMedicine.join()}, Medicine.id`);
                    const resultMedicineDetail = await this.getMedicineByCode(medicines.medicines[0].code, keyValueMedicineDetail.join());

                    if (resultMedicine.length === 1 || resultMedicineDetail.length === 1) {
                        const id = resultMedicine[0].id;
                        
                        delete resultMedicine[0].id
                        if (resultMedicine[0]) {
                            // update medicine
                            medicine = await this.medicineRepository.createQueryBuilder()
                            .update('Medicine')
                            .set({ ...keyValue })
                            .where("code = :code", {code: medicines.medicines[0].code}).andWhere("isDelete = false")
                            .execute();
                        }

                        if (resultMedicineDetail[0]) {
                            // update medicineDetail
                            medicine = await this.medicineRepository.createQueryBuilder()
                            .update('MedicineDetail')
                            .set({ ...valueMedicineDetail })
                            .where("medicineId = :id", {id}).andWhere("isDelete = false")
                            .execute();
                        }
                    } else {
                        const newMedicine = new Medicine({ ...medicines.medicines[0] });
                        medicine = await this.medicineRepository.save(newMedicine);
                    }
                }

                if (medicine) {
                    return {
                        status: 201,
                        statusText: 'SUCCESS',
                        message: 'Thành công!',
                        data: null,
                    }
                } else {
                    return {
                        status: 401,
                        statusText: 'ERROR',
                        message: 'Không thành công!',
                        data: null,
                    }
                }
            } else {
                return {
                    status: 400,
                    statusText: 'INVALID',
                    message: 'Dữ liệu không hợp lệ!',
                    data: null,
                }
            }

        } catch (error) {
            throw new ErrorResponse(...error, { errorCode: error.errorCode || "DATA_INVALID" });
        }
    }

    async getMedicineByCode(code?: string, column?: string): Promise<Medicine[]> {
        if (code) {
            const result = await this.medicineRepository.query(`
                select ${column.length > 0 ? column : '*'} from Medicine inner join MedicineDetail on Medicine.id = MedicineDetail.medicineId
            `);

            return result;
        }
        return null;
    }
}