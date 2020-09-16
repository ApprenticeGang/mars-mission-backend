import knex from "knex";
import  { Admin } from '../userManager'

export const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

export const checkDatabaseConnection = async (): Promise<boolean> => {
    try {
        await db.raw("SELECT 1 AS db_is_up");
        return true;
    } catch{
        return false;
    }
}


export const addAdmin = async(admin: Admin):Promise<void> => {
    await db
    .insert({email: admin.email, salt: admin.salt, password: admin.hashed_password}).into('admin')
}


//NOT FINISHED YET
// export const getAdminByEmail = (email: string) => {
//     return db("admin")
//         .where('email', email)
//         .select()
//         .first() }