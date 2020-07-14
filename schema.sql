CREATE ROLE byu_sell WITH
	LOGIN
	NOSUPERUSER
	NOCREATEDB
	NOCREATEROLE
	INHERIT
	NOREPLICATION
	CONNECTION LIMIT -1
	PASSWORD '';

CREATE DATABASE byu_and_sell
    WITH
    OWNER = byu_sell
    TEMPLATE = template0
    ENCODING = 'UTF8'
    LC_COLLATE = 'C'
    LC_CTYPE = 'C'
    CONNECTION LIMIT = -1;

GRANT ALL ON DATABASE byu_and_sell TO byu_sell;

CREATE TYPE offer_type AS ENUM ('buy', 'offer');

CREATE TABLE offers
(
    id bigserial NOT NULL,
    type offer_type NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(1000) NOT NULL,
    sum numeric NOT NULL,
    picture character varying(500),
    created_date DATE NOT NULL,
    user_id bigint NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT offers_users FOREIGN KEY (user_id)
        REFERENCES users (id) MATCH FULL
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE users
(
    id bigserial NOT NULL,
    first_name character varying(50) NOT NULL,
    last_name character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(50) NOT NULL,
    avatar character varying(50),
    PRIMARY KEY (id)
);
