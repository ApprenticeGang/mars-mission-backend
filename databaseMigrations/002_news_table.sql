DROP TABLE IF EXISTS news;

CREATE TABLE news (
    id SERIAL PRIMARY KEY,
    image_url TEXT,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    article_url TEXT NOT NULL,
    publish_date DATE
);