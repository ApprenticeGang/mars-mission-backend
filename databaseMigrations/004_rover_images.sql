DROP TABLE IF EXISTS images;

CREATE TABLE images (
    image_url VARCHAR(255) NOT NULL,
    rover_name VARCHAR(255),
    date DATE
)