import "reflect-metadata";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity, IBaseEntity } from './baseEntity/base.entity';
import { User } from './user.entity';
import { Medicine } from "./medicine.entity";

interface ICart extends IBaseEntity {
    user?: User,
    status?: boolean;
    medicine?: Medicine[];
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

    @OneToOne(() => User, (user) => user.cart, { cascade: true, nullable: true })
    @JoinColumn()
    users?: User;

    @OneToMany(() => Medicine, (medicine) => medicine.cart)
    medicine?: Medicine[];
}