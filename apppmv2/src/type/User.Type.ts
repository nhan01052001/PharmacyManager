
export type Account = {
    username: any;
    password: any;
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
    firstName: any;
    lastName: any;
    avatar?: any;
    phone?: any;
    email? : any;
    gender?: Gender;
    birthday?: any;
    address?: any;
};