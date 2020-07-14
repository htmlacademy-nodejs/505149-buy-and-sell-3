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
