# SportTrack Database

## Local Setup (Docker)

```bash
docker run -d \
  --name sporttrack-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=sporttrack \
  -p 5432:5432 \
  postgres:16-alpine
```

## Manual Init (without EF migrations)
```bash
psql -h localhost -U postgres -d sporttrack -f init.sql
```

## EF Core Migrations
```bash
cd ../backend/SportTrack.Api

# Create a new migration
dotnet ef migrations add InitialCreate --output-dir Infrastructure/Persistence/Migrations

# Apply migrations
dotnet ef database update
```

## Useful Queries

```sql
-- Live matches
SELECT * FROM matches WHERE status = 'Live';

-- Top scorers
SELECT name, team, goals, assists FROM players ORDER BY goals DESC LIMIT 10;

-- Standings (computed)
SELECT name, sport,
       wins, draws, losses,
       (wins * 3 + draws) AS points
FROM teams
ORDER BY sport, points DESC;
```
