-- SportTrack Database Schema
-- Run this to initialize the database manually (EF migrations handle it in code)

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Matches table
CREATE TABLE IF NOT EXISTS matches (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    home_team   VARCHAR(100) NOT NULL,
    away_team   VARCHAR(100) NOT NULL,
    home_score  INTEGER NOT NULL DEFAULT 0,
    away_score  INTEGER NOT NULL DEFAULT 0,
    sport       VARCHAR(50)  NOT NULL,
    status      VARCHAR(20)  NOT NULL DEFAULT 'Scheduled'
                    CHECK (status IN ('Scheduled', 'Live', 'Finished')),
    match_date  TIMESTAMPTZ  NOT NULL,
    venue       VARCHAR(200) NOT NULL,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_matches_status     ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_match_date ON matches(match_date DESC);
CREATE INDEX IF NOT EXISTS idx_matches_sport      ON matches(sport);

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    team       VARCHAR(100) NOT NULL,
    position   VARCHAR(50)  NOT NULL,
    sport      VARCHAR(50)  NOT NULL,
    goals      INTEGER NOT NULL DEFAULT 0,
    assists    INTEGER NOT NULL DEFAULT 0,
    points     INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_team  ON players(team);
CREATE INDEX IF NOT EXISTS idx_players_sport ON players(sport);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL,
    sport      VARCHAR(50)  NOT NULL,
    wins       INTEGER NOT NULL DEFAULT 0,
    losses     INTEGER NOT NULL DEFAULT 0,
    draws      INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    UNIQUE (name, sport)
);

CREATE INDEX IF NOT EXISTS idx_teams_sport ON teams(sport);

-- Seed data
INSERT INTO teams (name, sport, wins, losses, draws) VALUES
    ('Al Ahly',     'Football',   18, 2,  4),
    ('Zamalek',     'Football',   15, 4,  5),
    ('Pyramids FC', 'Football',   13, 6,  5),
    ('Smouha',      'Football',   11, 8,  5),
    ('Lakers',      'Basketball', 40, 25, 0),
    ('Bulls',       'Basketball', 35, 30, 0)
ON CONFLICT (name, sport) DO NOTHING;

INSERT INTO players (name, team, position, sport, goals, assists, points) VALUES
    ('Mohamed Salah',  'Liverpool',  'Forward',    'Football',   28, 11, 0),
    ('Amr Warda',      'PAOK',       'Midfielder', 'Football',   12, 15, 0),
    ('LeBron James',   'Lakers',     'Forward',    'Basketball',  0,  8, 27),
    ('Stephen Curry',  'Warriors',   'Guard',      'Basketball',  0,  6, 31)
ON CONFLICT DO NOTHING;

INSERT INTO matches (home_team, away_team, sport, status, match_date, venue, home_score, away_score) VALUES
    ('Al Ahly',    'Zamalek',   'Football',   'Live',      NOW(),                          'Cairo Stadium',    2, 1),
    ('Real Madrid','Barcelona', 'Football',   'Scheduled', NOW() + INTERVAL '1 day',       'Bernabeu',         0, 0),
    ('Lakers',     'Bulls',     'Basketball', 'Finished',  NOW() - INTERVAL '1 day',       'Staples Center',  98, 94)
ON CONFLICT DO NOTHING;
