import { PrimaryGeneratedColumn, Column } from 'typeorm';
import * as moment from 'moment';

export interface IBaseEntity {
    id?: number;
    createdBy?: number;
    createdAt?: number;
    updatedBy?: number;
    updatedAt?: number;
}

export abstract class BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, type: 'bigint' })
    createdBy?: number;

    @Column({ nullable: true, type: 'bigint', default: moment().unix() })
    createdAt?: number;

    @Column({ nullable: true, type: 'bigint' })
    updatedBy?: number;

    @Column({ nullable: true, type: 'bigint' })
    updatedAt?: number;

    constructor(props?: IBaseEntity) {
        const { id, createdBy, createdAt, updatedBy, updatedAt } = props || {};

        if (id) {
            this.id = id;
        }

        if (createdBy) {
            this.createdBy = createdBy;
        }

        if (createdAt) {
            this.createdAt = createdAt;
        }

        if (updatedBy) {
            this.updatedBy = updatedBy;
        }

        if (updatedAt) {
            this.updatedAt = updatedAt;
        }
    }
}