CREATE SCHEMA IF NOT EXISTS AUTHORIZATION universitaet;

ALTER ROLE universitaet SET search_path = 'universitaet';

CREATE TABLE IF NOT EXISTS universitaet (
    id INTEGER GENERATED ALWAYS AS IDENTITY(START WITH 1002) PRIMARY KEY USING INDEX TABLESPACE universitaetspace,
    version INTEGER NOT NULL DEFAULT 0,
    name TEXT NOT NULL,
    standort TEXT,
    anzahl_studierende INTEGER,
    homepage TEXT,
    gegruendet INTEGER,
    fakultaeten TEXT,
    ranking INTEGER,
    erzeugt TIMESTAMP NOT NULL DEFAULT NOW(),
    aktualisiert TIMESTAMP NOT NULL DEFAULT NOW()
) TABLESPACE universitaetspace;

CREATE TABLE IF NOT EXISTS bibliothek (
    id  integer GENERATED ALWAYS AS IDENTITY(START WITH 1002) PRIMARY KEY USING INDEX TABLESPACE universitaetspace,
    name TEXT NOT NULL,
    isil TEXT,
    universitaet_id INTEGER NOT NULL REFERENCES universitaet(id)
) TABLESPACE universitaetspace;

CREATE TABLE IF NOT EXISTS kurs (
    id integer GENERATED ALWAYS AS IDENTITY(START WITH 1004) PRIMARY KEY USING INDEX TABLESPACE universitaetspace,
    titel TEXT NOT NULL,
    start_datum DATE,
    universitaet_id INTEGER NOT NULL REFERENCES universitaet(id)
) TABLESPACE universitaetspace;
