DROP TABLE IF EXISTS timeline;

CREATE TABLE timeline(
id SERIAL PRIMARY KEY,
rover_name VARCHAR(255),
image_url VARCHAR(255),
date DATE,
timeline_entry TEXT 
);