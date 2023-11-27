export type ProductDetail = {
    id?: string;
    createdBy?: number;
    createdAt?: Date;
    updatedBy?: number;
    updatedAt?: Date;
    isDelete?: boolean;
    origin?: string;
    dateStart?: Date;
    dateEnd?: Date;
    conversionUnit?: string;
    rate?: number;
    importPrice?: number;
    describe?: string;
    manual?: string;
    VAT?: number;
    price?: number;
    quantity?: number;
    unit?: string;
    unitView?: string;
    lsImage?: string;
}

export type Product = {
    id?: string;
    createdBy?: number;
    createdAt?: Date;
    updatedBy?: number;
    updatedAt?: Date;
    isDelete?: boolean;
    code?: string;
    name?: string;
    fullName?: string;
    active?: boolean;
    type?: string,
    status?: boolean;
    medicineDetail?: ProductDetail;
    typeView?: string;
}