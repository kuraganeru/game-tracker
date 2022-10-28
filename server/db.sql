create database game-list;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY, 
    username VARCHAR
);

CREATE TABLE games(
    game_id SERIAL PRIMARY KEY,
    title VARCHAR(300)
);

CREATE TABLE genres(
    genre_id SERIAL PRIMARY KEY,
    genre VARCHAR
);

CREATE TABLE users_games(
    users_games_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (user_id),
    game_id INT REFERENCES games (game_id) ON DELETE CASCADE,
    game_status VARCHAR,
    game_rating INT,
    game_review VARCHAR,
    game_platform VARCHAR,
    year_completed INTEGER
);

CREATE TABLE games_genres(
    games_genres_id SERIAL PRIMARY KEY,
    game_id INT REFERENCES games (game_id),
    genre_id INT REFERENCES genres (genre_id)
);

CREATE TABLE patforms(
    platform
)

CREATE TABLE games_platforms(
    games_platforms_id SERIAL PRIMARY KEY,

)

alter table users_games
add column game_id INT

alter table users_games
add constraint fk_users_games_id
foreign key (game_id)
references games (game_id)
on delete cascade

alter table games_platforms
drop column games_id

alter table games_platforms
add column games_id int references games (game_id) on delete cascade