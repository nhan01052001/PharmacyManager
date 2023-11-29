import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MyJwtGuard } from '../service/guard/myjwt.guard';
import { Cart } from '../entity/cart.entity';
import { CartService } from '../service/cart.service';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {

    }

    @UseGuards(MyJwtGuard)
    @Get('/getCartByProfileID/:id')
    getCartByProfileID(@Param() param: any): Promise<unknown> {
        return this.cartService.getCartByProfileID(param?.id);
    }
}
