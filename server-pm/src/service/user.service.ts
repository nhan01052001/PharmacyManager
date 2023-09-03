import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
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

    async getUserByUsername(username: string): Promise<unknown> {
        return await this.userRepository.findOne({ where: {username: ILike(username), isDeleted: false} });
    }

}
