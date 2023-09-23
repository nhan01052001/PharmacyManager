import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { MedicineDetail } from "./medicine-detail.entity";
import { Cart } from "./cart.entity";
import { Order } from "./oder.entity";

interface IMedicine extends IBaseEntity {
    name?: string;
    fullName?: string;
    active?: boolean;
    type?: string,
    status?: boolean;
    medicineDetail?: MedicineDetail;
    cart?: Cart;
    order?: Order;
}

@Entity('Medicine')
export class Medicine extends BaseEntity {
    constructor(props?: IMedicine) {
        const {
            name,
            fullName,
            active,
            type,
            status,
            medicineDetail,
            cart,
            order,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            name,
            fullName,
            active,
            type,
            status,
            medicineDetail,
            cart,
            order,
        });
    }

    @Column({ nullable: true, width: 300 })
    name?: string;

    @Column({ nullable: true, width: 600 })
    fullName?: string;

    @Column({ nullable: true, default: false })
    active?: boolean;

    @Column({ nullable: true, width: 300 })
    type?: string;

    @Column({ nullable: true })
    status?: boolean;

    @OneToOne(() => MedicineDetail, (medicineDetail) => medicineDetail.medicine, {cascade: true, nullable: true})
    medicineDetail?: MedicineDetail;

    @ManyToOne(() => Cart, (cart) => cart.medicine)
    cart?: Cart;

    @ManyToOne(() => Order, (order) => order.medicine)
    order?: Order;
}