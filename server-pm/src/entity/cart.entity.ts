import "reflect-metadata";
import { Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { User } from './user.entity';
import { Medicine } from "./medicine.entity";

interface ICart extends IBaseEntity {
    user?: string,
    status?: boolean;
    medicine?: string;
}

@Entity('Cart')
export class Cart extends BaseEntity {
    constructor(props?: ICart) {
        const {
            user,
            status,
            medicine,
            ...superItem
        } = props || {};

        super(superItem);

        Object.assign(this, {
            user,
            status,
            medicine,
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
}