import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { User } from './user.entity';
import { Staff } from './staff.entity';
import { BillDetail } from './bill-detail.entity';

interface IBill extends IBaseEntity {
    typeBill?: boolean;
    note?: string;
    user?: User,
    staff?: Staff;
    status?: boolean;
    billDetail?: BillDetail;
}

@Entity('Bill')
export class Bill extends BaseEntity {
    constructor(props?: IBill) {
        const {
            typeBill,
            note,
            user,
            staff,
            status,
            billDetail,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            typeBill,
            note,
            user,
            staff,
            status,
            billDetail,
        });
    }

    @Column({ nullable: true })
    typeBill?: boolean;

    @Column({ nullable: true, width: 300 })
    note?: string;

    @Column({ nullable: true })
    status?: boolean;

    @ManyToOne(() => User, (user) => user.bill, { cascade: true, nullable: true })
    @JoinColumn()
    users?: User;

    @ManyToOne(() => Staff, (staff) => staff.bill, { cascade: true, nullable: true })
    @JoinColumn()
    staff?: Staff;

    @OneToOne(() => BillDetail, (billDetail) => billDetail.bill, {cascade: true, nullable: true})
    billDetail?: BillDetail;
}