import { Transform } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, IsNumber, IsPhoneNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class AddressParamsDTO {

    page?: number | string;

    pagesize?: number | string;

    sort?: boolean | string;

    typesort?: "ASC" | "DESC";
}