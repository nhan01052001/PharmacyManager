import { User } from "./entity/user.entity";
import { Staff } from "./entity/staff.entity";
import { Bill } from "./entity/bill.entity";
import { BillDetail } from "./entity/bill-detail.entity";
import { provinces } from "./entity/provinces.entity";
import { districts } from "./entity/districts.entity";
import { wards } from "./entity/wards.entity";

export const entities = [
    User,
    Staff,
    Bill,
    BillDetail,
    provinces,
    districts,
    wards
];