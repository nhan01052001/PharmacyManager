import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../service/guard/myjwt.guard';
import { UserService } from '../service/user.service';
import { User } from '../entity/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {

    }

    @UseGuards(MyJwtGuard)
    @Get('getAll')
    getAll(): Promise<unknown> {
        return this.userService.getAll();
    }

    @UseGuards(MyJwtGuard)
    @Get('getUserById/:id')
    getUserByID(@Param() param: any): Promise<User> {
        return this.userService.getUserByID(param?.id);
    }
}
