import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { MedicineDetail } from "./medicine-detail.entity";

interface IMedicine extends IBaseEntity {
    name?: string;
    fullName?: string;
    active?: boolean;
    type?: string,
    status?: boolean;
    medicineDetail?: MedicineDetail;
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
}