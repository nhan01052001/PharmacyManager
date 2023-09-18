import { Injectable, BadRequestException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { JwtService, JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from "src/repository/user.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entity/user.entity";
import { UserService } from "./user.service";
import { UserRegisterDTO, EmailDTO, PhoneNumberDTO } from "../validator/dto/user-register.dto";
import { UserLoginDTO } from '../validator/dto/user-login.dto';
import { ErrorResponse } from "../error/error-response.error";


@Injectable({})
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,

        private userService: UserService,

        @InjectRepository(User)
        private userRepository: UserRepository,
    ) { }

    async register(userRegister: UserRegisterDTO, headers: any): Promise<unknown> {
        const { username, password, firstName, lastName } = userRegister;
        // check username is not exists
        const data = await this.userService.getUserByUsername(username);

        if (data) {
            throw new ErrorResponse({ ...new BadRequestException('username is exists!'), errorCode: "USERNAME_EXISTS" });
        } else {
            // register on app
            if (headers?.isapp === 'true' || headers?.isapp === true) {
                if (this.checkUsername(username)) {
                    return this.createAccount(userRegister);
                }
            } else {
                // register web main
                return this.createAccount(userRegister);
            }
        }
    }

    async login(userLogin: UserLoginDTO): Promise<unknown> {
        const { username, password } = userLogin;

        if (username && password) {
            const data: User = await this.userService.getUserByUsername(username);

            if (data) {
                if (!bcrypt.compareSync(password, data.password)) {
                    throw new ErrorResponse({ ... new BadRequestException('Invalid username or password! Please again.'), errorCode: "INVALID_USERNAME_PASSWORD" });
                } else {
                    delete data.password;
                    return {
                        errorCode: null,
                        successCode: "SUCCESS",
                        message: 'Logged in successfully!',
                        statusCode: 200,
                        data: data,
                        accessToken: (await this.signWithToken(data.id, data.username))
                            .accessToken,
                    }
                }
            } else {
                throw new ErrorResponse({ ... new BadRequestException('Invalid username or password! Please again.'), errorCode: "INVALID_USERNAME_PASSWORD" });
            }
        } else {
            throw new ErrorResponse({ ... new BadRequestException('username and password is not empty!'), errorCode: "USERNAME_PASSWORD_IS_NOT_EMPTY" });
        }

        return;
    }

    isValidNumberPhone = (numberPhone: string): unknown => {
        return /((0[3|5|7|8|9])+([0-9]{8})|([+]84[3|5|7|8|9])+([0-9]{8}))\b/g.test(numberPhone);
    };

    isValidEmail = (email: string): unknown => {
        return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
    }

    checkUsername = (username: string): unknown => {
        const regexNumber = /^\d+\.?\d*$/;

        // check username is email
        if (username.includes('@')) {
            if (this.isValidEmail(username)) {
                return true;
            } else {
                throw new ErrorResponse({ ...new BadRequestException('Email Invalid!'), errorCode: "EMAIL_INVALID" });
            }
        } else {
            // or username is numberPhone
            if (regexNumber.test(username)) {
                // check numberphone valid
                if (this.isValidNumberPhone(username)) {
                    return true;
                } else {
                    throw new ErrorResponse({ ...new BadRequestException('NumberPhone Invalid!'), errorCode: "NUMBERPHONE_INVALID" });
                }
            } else {
                throw new ErrorResponse({ ...new BadRequestException('Email or NumberPhone Invalid!'), errorCode: "USERNAME_INVALID" });
            }
        }
    }

    async createAccount(userRegister: UserRegisterDTO): Promise<unknown> {
        debugger
        const { username, password, firstName, lastName } = userRegister;
        console.log({...userRegister},'userRegister');
        
        let fullName = firstName + " " + lastName;
        const newUser = new User({ ...userRegister, password: bcrypt.hashSync(password, 10), fullName, isDeleted: false, isFirstLogin: false });

        try {
            const user = await this.userRepository.save(newUser);
            delete user.password;
            return user;
        } catch (error) {
            throw new ErrorResponse(...error, { errorCode: error.errorCode || "DON'T_CREATE_ACCOUNT!" });
        }
    }

    async signWithToken(userId: string, username: string): Promise<{ accessToken: string }> {
        const payload = {
            sub: userId,
            username,
        };

        const jwt = await this.jwtService.signAsync(payload, {
            expiresIn: '5m',
            secret: this.configService.get('JWT_SECRET'),
        });

        return {
            accessToken: jwt,
        };
    }
}