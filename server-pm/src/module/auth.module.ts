import { Module } from "@nestjs/common";
import { AuthController } from "../controller/auth.controller";
import { AuthService } from "../service/auth.service";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { UserService } from "src/service/user.service";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { entities } from "../entities.provider";
import { JwtStrategy } from "../service/strategy/jwt.strategy";

@Module({
    imports: [JwtModule.register({}), TypeOrmModule.forFeature(entities)],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        UserService,
        JwtService,
        ConfigService,
        JwtStrategy
    ],
    exports: [AuthService]
})

export class AuthModule {}