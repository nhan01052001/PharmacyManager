
export type Account = {
    username?: any;
    password?: any;
    confirmPassword?: any;
};

type Gender = {
    male: {
        isMale: boolean,
        maleView: any
    },
    female: {
        isFemale: boolean,
        femaleView: any
    },
    other: {
        isOther: boolean,
        otherView: any
    }
};

export type User = {
    account: Account,
    firstName?: string;
    lastName?: string;
    fullName?: string;
    avatar?: string;
    phone?: string;
    email? : string;
    gender?: Gender;
    birthday?: any;
    address?: string;
};