DROP TABLE IF EXISTS rovers;

CREATE TABLE rovers(
id SERIAL PRIMARY KEY,
rover_name VARCHAR(255),
image_url VARCHAR(255),
date DATE,
rover_info TEXT 
)