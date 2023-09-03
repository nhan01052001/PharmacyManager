import { Controller, Get, Post } from '@nestjs/common';
import { UserService } from 'src/service/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @Get('getAll')
    getAll(): Promise<unknown> {
        return this.userService.getAll();
    }
}
