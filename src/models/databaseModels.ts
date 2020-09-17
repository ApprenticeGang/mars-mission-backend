export interface Editor {
    id: number;
    email: string;
    salt: string;
    hashed_password: string;
}