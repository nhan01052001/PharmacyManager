import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Cart } from '../entity/cart.entity';
import { Bill } from '../entity/bill.entity';

import { UserRepository } from '../repository/user.repository';
import { CartRepository } from '../repository/cart.repository';
import { BillRepository } from '../repository/bill.repository';

import { ErrorResponse } from '../error/error-response.error';
import { ILike } from 'typeorm';
import { ENUM } from '../util/enum.util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: UserRepository,

        @InjectRepository(Cart)
        private readonly cartRepository: CartRepository,

        @InjectRepository(Bill)
        private readonly billRepository: BillRepository,

    ) { }

    async getAll(): Promise<unknown> {
        return await this.userRepository.find();
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({ where: { username: ILike(username), isDelete: false, isLoginSocial: false } });
    }

    async getUserByID(id: string): Promise<User> {
        if (id) {
            const user = await this.userRepository.findOne({ where: { id: ILike(id), isDelete: false } });
            user?.password && delete user.password;
            return user ? user : {};
        } else {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

    async getUserLoginSocial(id: string): Promise<User> {
        return await this.userRepository.findOne({ where: { id: ILike(id), isDelete: false, isLoginSocial: true } });
    }

    async addDeliveryAddress(dataBody: {
        id: string,
        deliveryAddress: string
    }): Promise<unknown> {
        try {
            const { id, deliveryAddress } = dataBody;

            if (id.length > 0 && deliveryAddress.length > 0) {
                const user = await this.getUserByID(id);
                if (user) {
                    // let deliveryAddressTemp: any[] = JSON.parse(user.deliveryAddress);
                    let deliveryAddressNew: any[] = JSON.parse(deliveryAddress);
                    // deliveryAddressTemp.push(deliveryAddressNew);

                    const resultUpdateUser = await this.userRepository.createQueryBuilder()
                        .update('User')
                        .set({ deliveryAddress: JSON.stringify(deliveryAddressNew) })
                        .where("id = :id", { id: id }).andWhere("isDelete = false")
                        .execute();

                    if (resultUpdateUser && resultUpdateUser.affected > 0) {
                        return {
                            status: 200,
                            statusText: ENUM.E_SUCCESS,
                            message: 'Thành công!',
                            data: [],
                        }
                    } else {
                        return {
                            status: 400,
                            statusText: ENUM.E_ERROR,
                            message: 'Không thành công!',
                            data: null,
                        }
                    }
                } else {
                    return {
                        status: 400,
                        statusText: ENUM.E_ERROR,
                        message: 'Không thành công!',
                        data: null,
                    }
                }
            }

            return {
                status: 400,
                statusText: ENUM.E_ERROR,
                message: 'Không thành công!',
                data: null,
            }
        } catch (error) {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

    async countNumberCartAndBill(id: string): Promise<unknown> {
        try {
            if (id) {

                //#region: cart
                const rsCountCart = await this.cartRepository.createQueryBuilder('Cart')
                    .where(`Cart.users = "${id}"`)
                    .andWhere("Cart.status = false")
                    .andWhere("Cart.isDelete = false").getCount();
                //#endregion

                //#region: bill waiting confirm
                const rsCountBillWaitingConfirm = await this.cartRepository.createQueryBuilder('Cart')
                    .where(`Cart.users = "${id}"`)
                    .andWhere("Cart.status = true")
                    .andWhere("Cart.isDelete = false").getCount();
                //#endregion

                //#region: bill confirmed
                const rsCountConfirmed: number = await this.queryGetCount(id, true, false, false);
                //#endregion

                //#region: bill delivering
                const rsCountDelivering: number = await this.queryGetCount(id, false, true, false);
                //#endregion

                //#region: bill Canceled
                const rsCountCanceled: number = await this.queryGetCount(id, true, false, true);
                //#endregion

                const totalCountInBill: number = rsCountBillWaitingConfirm + rsCountConfirmed + rsCountDelivering + rsCountCanceled;

                return {
                    status: 200,
                    statusText: ENUM.E_SUCCESS,
                    message: 'Thành công',
                    data: {
                        countCart: rsCountCart,
                        coutnBillWaitingConfirm: rsCountBillWaitingConfirm,
                        countBillConfirmed: rsCountConfirmed,
                        countBillDelivering: rsCountDelivering,
                        countBillCanceled: rsCountCanceled,
                        totalCountInBill: totalCountInBill,
                    },
                }
            }
            return {
                status: 400,
                statusText: ENUM.E_ERROR,
                message: 'Không thành công!',
                data: null,
            }
        } catch (error) {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

    async queryGetCount(id: string, isConfirmed: boolean, isDelivering: boolean, isCanceled: boolean): Promise<number> {
        try {
            const result = await this.cartRepository.query(
                `
                    select count(*) as numberCount from Bill
                    LEFT JOIN BillDetail b ON b.billId = Bill.id
                    LEFT JOIN Medicine m ON m.id = b.medicine
                    LEFT JOIN MedicineDetail d ON m.id = d.medicineId
                    WHERE Bill.isDelete = false AND b.isDelete = false 
                    AND Bill.userId = "${id}"
                    AND Bill.status = false
                    AND Bill.isConfirmed = ${isConfirmed}
                    AND Bill.isDelivering = ${isDelivering}
                    AND Bill.isCanceled = ${isCanceled}
                    `
            );

            if (Array.isArray(result)) {
                return Number(result[0]?.numberCount);
            }

            return 0;
        } catch (error) {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

}
