import { Transform, Type } from 'class-transformer';
import { ArrayMinSize, IsEmail, IsEmpty, IsNotEmpty, IsPhoneNumber, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';
import { MedicineDetailDTO } from './medicineDetail.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MedicineDTO {

    id?: string;

    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    fullName: string;

    active?: boolean;

    @IsString()
    type?: string;

    status?: boolean;

    @IsNotEmpty()
    @Type(() => MedicineDetailDTO)
    @ValidateNested()
    medicineDetail?: MedicineDetailDTO;
}

export class MedicinesDTO {
   @ApiProperty({ type: [MedicineDTO]})
   @Type(() => MedicineDTO)
   @ArrayMinSize(1)
   @ValidateNested({each: true})
    medicines: MedicineDTO[];
}
