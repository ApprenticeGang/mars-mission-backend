import knex from "knex";

const db = knex({
    client: 'pg',
    connection: process.env.DATABASE_URL
});

export const checkDatabaseConnection = async(): Promise<boolean> =>{
    try{
        await db.raw("SELECT 1 AS db_is_up");
        return true;
    }catch{
        return false;
    }
}