import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../service/guard/myjwt.guard';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @UseGuards(MyJwtGuard)
    @Get('getAll')
    getAll(): Promise<unknown> {
        return this.userService.getAll();
    }
}
