import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { ErrorResponse } from '../error/error-response.error';
import { UserRepository } from '../repository/user.repository';
import { ILike } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: UserRepository,

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
            delete user.password;
            return user;
        } else {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

    async getUserLoginSocial(id: string): Promise<User> {
        return await this.userRepository.findOne({ where: { id: ILike(id), isDelete: false, isLoginSocial: true } });
    }

}
