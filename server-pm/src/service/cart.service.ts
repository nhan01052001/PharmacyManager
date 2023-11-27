import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorResponse } from '../error/error-response.error';
import { Cart } from '../entity/cart.entity';
import { CartRepository } from '../repository/cart.repository';

@Injectable()
export class CartService {
    constructor(
        @InjectRepository(Cart)
        private readonly cartRepository: CartRepository,

    ){}

}
