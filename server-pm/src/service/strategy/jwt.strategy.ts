import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user.service';
import { User } from '../../entity/user.entity';
import { UserRepository } from '../../repository/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(configService: ConfigService, 
        private userService: UserService,
        @InjectRepository(User)
        private readonly userRepository: UserRepository,
        ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: string; username: string }) {
        const user = await this.userRepository.findOne({ where: {id: ILike(payload.sub), isDeleted: false} });
        delete user.password;
        return user;
    }
}
