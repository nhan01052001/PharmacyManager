import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { MedicineDetail } from "./medicine-detail.entity";

interface ISupplier extends IBaseEntity {
    phone?: string;
    email?: string;
    name?: string,
    address?: string;
    status?: boolean;
    medicineDetail?: MedicineDetail;
}

@Entity('Supplier')
export class Supplier extends BaseEntity {
    constructor(props?: ISupplier) {
        const {
            phone,
            email,
            name,
            address,
            status,
            medicineDetail,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            phone,
            email,
            name,
            address,
            status,
            medicineDetail,
        });
    }

    @Column({ nullable: true, width: 32 })
    phone?: string;

    @Column({ nullable: true, width: 128 })
    email?: string;

    @Column({ nullable: true })
    status?: boolean;

    @Column({ nullable: true, width: 600 })
    name?: string;

    @Column({ nullable: true, width: 600 })
    address?: string;

    @OneToOne(() => MedicineDetail, (medicineDetail) => medicineDetail.supplier)
    medicineDetail?: MedicineDetail;
}