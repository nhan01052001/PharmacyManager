
export type Account = {
    username: any;
    password: any;
    confirmPassword?: any;
};

export type User = {
    account: Account,
    firstName: any;
    lastName: any;
    avatar?: any;
    phone?: any;
    email? : any;
    gender?: any;
    birthday?: any;
};