import "reflect-metadata";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { User } from './user.entity';
import { Medicine } from "./medicine.entity";

interface ICart extends IBaseEntity {
    user?: string,
    status?: boolean;
    medicine?: string;
    unitPurchase?: string,
    quantityPurchase?: number;
    pricePurchase?: number;
}

@Entity('Cart')
export class Cart extends BaseEntity {
    constructor(props?: ICart) {
        const {
            user,
            status,
            medicine,
            quantityPurchase,
            unitPurchase,
            pricePurchase,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            user,
            status,
            medicine,
            unitPurchase,
            quantityPurchase,
            pricePurchase,
        });
    }

    @Column({ nullable: true })
    status?: boolean;

    @OneToOne(() => User, (user) => user.cart)
    // @JoinColumn()
    // @Index({unique: false})
    @Column({ nullable: true })
    users?: string;

    @OneToOne(() => Medicine, (medicine) => medicine.cart)
    // @JoinColumn()
    // @Index({unique: false})
    @Column({ nullable: true })
    medicine?: string;

    @Column({ nullable: true })
    quantityPurchase?: number;

    @Column({ nullable: true })
    unitPurchase?: string;

    @Column('decimal', { nullable: true, })
    pricePurchase?: number;
}