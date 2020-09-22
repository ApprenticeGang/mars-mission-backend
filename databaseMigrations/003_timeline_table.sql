DROP TABLE IF EXISTS timeline_entry;

CREATE TABLE timeline_entry(
id SERIAL PRIMARY KEY,
heading VARCHAR NOT NULL,
rover_name VARCHAR(255) NOT NULL,
image_url VARCHAR(255),
date DATE NOT NULL,
timeline_entry TEXT 
);