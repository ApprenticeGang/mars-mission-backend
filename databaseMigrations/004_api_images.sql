DROP TABLE IF EXISTS images;

CREATE TABLE images (
    id VARCHAR(6),
    sol VARCHAR(6),
    cameraName VARCHAR(10),
    cameraFullName VARCHAR(255),
    imageUrl VARCHAR(255),
    earthDate DATE,
    roverName VARCHAR(255)

)