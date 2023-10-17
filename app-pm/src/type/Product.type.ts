export type Product = {
    id: string;
    name: string;
    priceCourse: number;
    pricePromotion?: number;
    isPromotion?: boolean,
    unit?: {
        box?: boolean,
        pill?: boolean,
        bottle?: boolean,
    },
    imgProduct: string,
}