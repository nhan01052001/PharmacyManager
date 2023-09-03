import { Controller, Post, Req, Body, Get, Param, Headers } from "@nestjs/common";

import { AuthService } from "src/service/auth.service";
import { UserRegisterDTO } from "../validator/dto/user-register.dto";


@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Post('/register')
    register(@Body() userRegister: UserRegisterDTO, @Headers() headers: any): Promise<unknown> {
        return this.authService.register(userRegister, headers);
    }
}