import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { ErrorResponse } from 'src/error/error-response.error';
import { UserRepository } from 'src/repository/user.repository';
import { ILike } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: UserRepository,

    ){}

    async getAll(): Promise<unknown> {
        return await this.userRepository.find();
    }

    async getUserByUsername(username: string): Promise<User> {
        return await this.userRepository.findOne({ where: {username: ILike(username), isDeleted: false} });
    }

    async getUserByID(id: string): Promise<User> {
        if(id) {
            const user = await this.userRepository.findOne({ where: {id: ILike(id), isDeleted: false} });
            delete user.password;
            return user;
        } else {
            throw new ErrorResponse({ ...new BadRequestException('NOT FOUND USER'), errorCode: "NOT_FOUND" });
        }
    }

}
