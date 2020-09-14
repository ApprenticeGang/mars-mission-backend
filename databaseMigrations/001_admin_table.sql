DROP TABLE IF EXISTS admin;

CREATE TABLE admin (
    id SERIAL PRIMARY KEY,  
    email VARCHAR(255) NOT NULL UNIQUE,
    salt VARCHAR(255) ,
    hashed_password VARCHAR(255)

)

INSERT INTO admin (email)
VALUES ('email@email.com');\q
