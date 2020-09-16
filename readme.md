# Mars mission back end

## Setup
Start by getting an API key from the [NASA API](https://api.nasa.gov/)

## Create a database and run sql script
CREATE DATABASE my_database_name
psql -U postgres -d my_database_name -f 001_admin_table.sql;

### Environment variables
Create a `.env` file in the root of the project, add the following environment variables: 
- NASA_API_KEY: Your API key
- DATABASE_URL: postgres://username:password@localhost:5432/db-name
