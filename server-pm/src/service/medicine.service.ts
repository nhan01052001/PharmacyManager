import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";

import { ErrorResponse } from "../error/error-response.error";
import { ILike, SelectQueryBuilder } from "typeorm";
import { entities } from "../entities.provider";
import { MedicineRepository } from "../repository/medicines.repository";
import { Medicine } from "../entity/medicine.entity";
import { MedicineDTO, MedicinesDTO } from "../validator/dto/medicine.dto";
import { FilterParamsDTO } from "../validator/dto/Address-params.dto";
import { ProvincesService } from "./provinces.service";
import { FindDTO } from "../validator/dto/find.dto";
import moment from "moment";
import { ENUM } from "../util/enum.util";

@Injectable()
export class MedicinesService {
    constructor(

        @InjectRepository(Medicine)
        private readonly medicineRepository: MedicineRepository,

        private provincesService: ProvincesService,

    ) { }

    async addMedicines(headers: any, medicines?: MedicinesDTO): Promise<unknown> {
        try {
            if (medicines) {

                let medicine = null;
                if (medicines.medicines.length > 1) {
                    let listNoReady = [];
                    let listReady = [];
                    await Promise.all(
                        medicines.medicines.map(async (item) => {
                            const result = await this.getMedicineByCode(item.code, "Medicine.id");

                            if (result.length === 0) {
                                listNoReady.push(item);
                            } else {
                                listReady.push(item);
                            }
                        })
                    );

                    if (listNoReady.length > 0) {
                        medicine = await this.medicineRepository.save([...listNoReady]);
                    }

                    if (listReady.length > 0) {
                        return {
                            status: 200,
                            statusText: 'SUCCESS',
                            message: 'Dữ liệu đã tồn tại, vui lòng chọn chỉnh sửa, không được phép tạo mới!',
                            data: listReady,
                        }
                    }

                    //medicine = await this.medicineRepository.createQueryBuilder().insert().into('Medicine').values([...medicines.medicines]).execute();

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
                                .where("code = :code", { code: medicines.medicines[0].code }).andWhere("isDelete = false")
                                .execute();
                        }

                        if (resultMedicineDetail[0]) {
                            // update medicineDetail
                            medicine = await this.medicineRepository.createQueryBuilder()
                                .update('MedicineDetail')
                                .set({ ...valueMedicineDetail })
                                .where("medicineId = :id", { id }).andWhere("isDelete = false")
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
                select ${column && column.length > 0 ? column : '*'} 
                    from Medicine 
                    inner join MedicineDetail on Medicine.id = MedicineDetail.medicineId
                    where Medicine.code = "${code}" and Medicine.isDelete = false and MedicineDetail.isDelete = false
            `);

            return result;
        }
        return null;
    }

    async getMedicineById(id?: string, column?: string): Promise<Medicine[]> {
        if (id) {
            const result = await this.medicineRepository.query(`
                select ${column && column.length > 0 ? column : '*'} 
                    from Medicine 
                    inner join MedicineDetail on Medicine.id = MedicineDetail.medicineId
                    where Medicine.id = "${id}" and Medicine.isDelete = false and MedicineDetail.isDelete = false
            `);

            return result;
        }
        return null;
    }

    async updateOneMedicine(headers?: any, model?: any, tableName?: string, value?: any): Promise<unknown> {
        try {
            if (Array.isArray(model.medicines) && model.medicines.length > 0) {
                let resultNoSuccess = [];
                let resultSuccess = [];

                await Promise.all(
                    model.medicines.map(async (item: any) => {
                        const { id, medicineDetail } = item;
                        delete item.medicineDetail;

                        if (id) {
                            delete item?.id;

                            const resultUpdateMedicine = await this.medicineRepository.createQueryBuilder()
                                .update('Medicine')
                                .set({ ...item })
                                .where("id = :id", { id: id }).andWhere("isDelete = false")
                                .execute();

                            if (!resultUpdateMedicine || resultUpdateMedicine.affected <= 0) {
                                resultNoSuccess.push(id);
                            } else {
                                resultSuccess.push(id);
                            }
                        }

                        if (medicineDetail?.medicineId && id) {
                            delete medicineDetail?.medicineId;

                            const resultUpdateMedicineDetail = await this.medicineRepository.createQueryBuilder()
                                .update('MedicineDetail')
                                .set({
                                    ...medicineDetail
                                })
                                .where("medicineId = :id", { id: id }).andWhere("MedicineDetail.isDelete = false")
                                .execute();
                            if (!resultUpdateMedicineDetail || resultUpdateMedicineDetail.affected <= 0) {
                                if (!resultNoSuccess.includes(id))
                                    resultNoSuccess.push(id);
                            } else {
                                if (!resultSuccess.includes(id))
                                    resultSuccess.push(id);
                            }
                        }
                    })
                )

                if (resultNoSuccess.length > 0) {
                    if (resultSuccess.length > 0) {
                        return {
                            status: 200,
                            statusText: "SUCCESS",
                            message: `Cập nhật ${resultSuccess.length}/${model.medicines.length} thành công!`,
                            data: resultSuccess,
                        }
                    } else {
                        return {
                            status: 401,
                            statusText: "ERROR",
                            message: 'Không thành công!',
                            data: resultNoSuccess,
                        }
                    }
                } else {
                    return {
                        status: 200,
                        statusText: "SUCCESS",
                        message: 'Cập nhật tất cả thành công!',
                        data: null,
                    }
                }
            }
        } catch (error) {
            throw new ErrorResponse(...error, { errorCode: error.errorCode || "DATA_INVALID" });
        }
    }

    async deleteMedicine(body?: any): Promise<unknown> {
        try {
            if (Array.isArray(body?.listId) && body?.listId.length > 0) {
                let resultNoSuccess = [];
                let resultSuccess = [];
                await Promise.all(
                    body?.listId.map(async (item: string) => {
                        const resultDeleteMedicine = await this.medicineRepository.createQueryBuilder()
                            .update('Medicine')
                            .set({ isDelete: true })
                            .where("id = :id", { id: item }).andWhere("isDelete = false")
                            .execute();
                        const resultDeleteMedicineDetail = await this.medicineRepository.createQueryBuilder()
                            .update('MedicineDetail')
                            .set({ isDelete: true })
                            .where("medicineId = :id", { id: item }).andWhere("isDelete = false")
                            .execute();

                        if (!resultDeleteMedicine || !resultDeleteMedicineDetail || resultDeleteMedicine.affected <= 0 || resultDeleteMedicineDetail.affected <= 0) {
                            resultNoSuccess.push(item);
                        } else {
                            resultSuccess.push(item);
                        }
                    })
                );



                if (resultNoSuccess.length > 0) {
                    if (resultSuccess.length > 0) {
                        return {
                            status: 200,
                            statusText: "SUCCESS",
                            message: `Xoá ${resultSuccess.length}/${body?.listId.length} thành công!`,
                            data: resultSuccess,
                        }
                    } else {
                        return {
                            status: 401,
                            statusText: "ERROR",
                            message: 'Không thành công!',
                            data: resultNoSuccess,
                        }
                    }
                } else {
                    return {
                        status: 200,
                        statusText: "SUCCESS",
                        message: 'Xoá tất cả thành công!',
                        data: null,
                    }
                }
            }
            return {
                status: 401,
                statusText: "ERROR",
                message: 'Không hợp lệ!',
                data: null,
            };
        } catch (error) {
            throw new ErrorResponse(...error, { errorCode: error.errorCode || "DATA_INVALID" });
        }
    }

    async revertDeleteMedicine(body?: any): Promise<unknown> {
        try {
            if (Array.isArray(body?.listId) && body?.listId.length > 0) {
                let result = [];
                await Promise.all(
                    body?.listId.map(async (item: string) => {
                        const resultDeleteMedicine = await this.medicineRepository.createQueryBuilder()
                            .update('Medicine')
                            .set({ isDelete: false })
                            .where("id = :id", { id: item }).andWhere("isDelete = true")
                            .execute();
                        const resultDeleteMedicineDetail = await this.medicineRepository.createQueryBuilder()
                            .update('MedicineDetail')
                            .set({ isDelete: false })
                            .where("medicineId = :id", { id: item }).andWhere("isDelete = true")
                            .execute();

                        if (!resultDeleteMedicine || !resultDeleteMedicineDetail || resultDeleteMedicine.affected <= 0 || resultDeleteMedicineDetail.affected <= 0) {
                            result.push(item);
                        }
                    })
                );

                if (result.length > 0) {
                    return {
                        status: 401,
                        statusText: "ERROR",
                        message: 'Không thành công!',
                        data: result,
                    }
                } else {
                    return {
                        status: 200,
                        statusText: "SUCCESS",
                        message: 'Cập nhật thành công!',
                        data: null,
                    }
                }
            }
            return null;
        } catch (error) {
            throw new ErrorResponse(...error, { errorCode: error.errorCode || "DATA_INVALID" });
        }
    }

    async findMedicine(headers: any, search?: string, typeFind?: string, body?: FindDTO): Promise<unknown> {
        let { page, pagesize, sort, typesort }: FilterParamsDTO = headers;
        const { findByPrice, findByDateEnd, type, quantity } = body;

        try {
            let take = 1 * 20;
            let skip = take - 20;
            let message= '';

            let data = await this.medicineRepository
                .createQueryBuilder('Medicine')
                .leftJoin('MedicineDetail', 'd', 'Medicine.id = d.medicineId')
                .where("Medicine.isDelete = false").andWhere("d.isDelete = false");
            let totalItem: number = await data.getCount(),
                totalPage: number = 0;

            if (search && search.length > 0) {
                data.andWhere(`Medicine.${typeFind && typeFind.length > 0 && typeFind !== 'type' ? typeFind : 'name' } LIKE :search`, { search: `%${search}%` });
            }

            if(type) {
                data.andWhere(`Medicine.type = ${type.value ? type.value : ''}`);
            }

            if(quantity) {
                data.andWhere(`d.quantity <= ${quantity.value ? quantity.value : 0} OR d.quantity = NULL`);
            }

            if(findByPrice) {
                data.andWhere(`d.price >= ${findByPrice.fromPrice ? findByPrice.fromPrice : 0} and d.price <= ${findByPrice.toPrice ? findByPrice.toPrice : 0}`);
                if(findByPrice.fromPrice > findByPrice.toPrice) {
                    message = message + ' | Đến giá không thể nhỏ hơn từ giá';
                }
            }

            if(findByDateEnd) {
                data.andWhere(`d.dateEnd >= ${findByDateEnd.fromDate ? findByDateEnd.fromDate : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')} and d.dateEnd <= ${findByDateEnd.toDate ? findByDateEnd.toDate : moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}`);
                if(findByDateEnd.fromDate > findByDateEnd.toDate) {
                    message = message + ' | Đến giá không thể nhỏ hơn từ giá';
                }
            }

            if ((page && pagesize) || ((sort as boolean) && typesort)) {
                const temp = await this.provincesService.handlePaging({ page, pagesize, sort, typesort }, totalItem, data, 'Medicine', 'name');
                totalPage = temp.totalPage;
                if (temp.status === 'SUCCESS') {
                    data = temp.data;
                }
            }

            const result = await data.getMany();
            if (result) {
                result.forEach((element) => {
                    element.typeView = ENUM[`${element.type}`];
                })
                return {
                    status: 200,
                    statusText: 'SUCCESS',
                    message: message.length === 0 ? 'Thành công!' : message,
                    data: result,
                    totalItem,
                    totalPage
                }
            } else {
                return {
                    status: 200,
                    statusText: 'EMPTY',
                    message: 'Không có dữ liệu!',
                    data: [],
                    totalItem,
                    totalPage
                }
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async saleMedicine(headers: any): Promise<unknown> {

        return;
    }

}