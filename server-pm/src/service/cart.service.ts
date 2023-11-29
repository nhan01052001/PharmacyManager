import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '../error/error-response.error';
import { Cart } from '../entity/cart.entity';
import { CartRepository } from '../repository/cart.repository';
import { ENUM } from '../util/enum.util';
import { MedicinesService } from './medicine.service';
import { MedicineRepository } from '../repository/medicines.repository';
import { Medicine } from '../entity/medicine.entity';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: CartRepository,

        private readonly medicinesService: MedicinesService,

        @InjectRepository(Medicine)
        private readonly medicineRepository: MedicineRepository,

    ) { }

    async getCartByProfileID(id?: string): Promise<unknown> {
        try {
            if (id && id.length > 0) {
                const result = await this.cartRepository.query(
                    `
                    select *, c.id as cartId, m.id as medicineID from Cart c
	                    LEFT JOIN User u ON u.id = c.users
                        LEFT JOIN Medicine m ON m.id = c.medicine
                        LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                        WHERE c.isDelete = false AND u.isDelete = false AND m.isDelete = false
                        AND c.users = "${id}"
                    `
                )

                if (result) {
                    if (Array.isArray(result) && result.length > 0) {
                        result.forEach((element, index) => {
                            if (element?.unitPurchase) {
                                element.unitPurchaseView = [
                                    {
                                        id: index,
                                        name: ENUM[`${element?.unitPurchase.trim()}`],
                                        isHave: true,
                                        isActive: true,
                                        code: element?.unitPurchase,
                                    }
                                ]
                            }
                        })
                    }
                    return {
                        status: 200,
                        statusText: ENUM.E_SUCCESS,
                        message: "Thành công!",
                        data: result,
                    }
                }
            } else {
                return {
                    status: 400,
                    statusText: ENUM.E_ERROR,
                    message: "",
                    data: null,
                }
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async getCartById(id: string): Promise<Cart> {
        try {
            if (id.length > 0) {
                const rs = this.cartRepository.createQueryBuilder('Cart')
                    .where('Cart.isDelete = false')
                    .andWhere('Cart.status = false')
                    .andWhere(`Cart.id = "${id}"`).getOne();


                return rs;
            }
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }

    async updateQuantityAndPrice(dataBody?: any): Promise<unknown> {
        try {
            const id = dataBody?.id ? dataBody?.id : null;
            const quantity = dataBody?.quantity ? Number(dataBody?.quantity) : 0;
            const medicineId = dataBody?.medicineId ? dataBody?.medicineId : null;

            if (id && quantity > 0 && medicineId) {
                const medicines = await this.medicinesService.getMedicineById(medicineId);
                const carts = await this.getCartById(id);
                const increase = Number(carts.quantityPurchase) < quantity ? true : false
                const quantityTemp = increase
                    ? quantity - Number(carts.quantityPurchase)
                    : Number(carts.quantityPurchase) - quantity;
                if (medicines) {
                    if (increase && Number(medicines?.medicineDetail?.quantity) < quantityTemp) {
                        return {
                            status: 401,
                            statusText: "ERROR",
                            message: 'Đã hết hàng!',
                            data: [medicineId],
                        }
                    } else {
                        const price = Number(medicines?.medicineDetail?.price) * quantity;
                        const quantityMedicineUpdate = increase ? Number(medicines?.medicineDetail?.quantity) + quantityTemp : Number(medicines?.medicineDetail?.quantity) - quantityTemp;
                        await this.cartRepository.createQueryBuilder()
                            .update('Cart')
                            .set({
                                quantityPurchase: quantity,
                                pricePurchase: price
                            })
                            .where("id = :id", { id: id }).andWhere("Cart.isDelete = false").andWhere('Cart.status = false')
                            .execute();

                        await this.medicineRepository.createQueryBuilder()
                            .update('MedicineDetail')
                            .set({
                                quantity: quantityMedicineUpdate
                            })
                            .where("medicineId = :id", { id: medicineId }).andWhere("MedicineDetail.isDelete = false")
                            .execute();
                    }
                }
            }

            return;
        } catch (error) {
            throw new ErrorResponse({ ... new BadRequestException(error), errorCode: "FAIL" });
        }
    }
}
