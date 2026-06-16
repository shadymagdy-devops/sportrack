using MediatR;
using Microsoft.EntityFrameworkCore;
using SportTrack.Api.Domain.Entities;
using SportTrack.Api.Infrastructure.Persistence;

namespace SportTrack.Api.Features.Teams;

public record TeamDto(Guid Id, string Name, string Sport, int Wins, int Losses, int Draws, int Points);
public record CreateTeamRequest(string Name, string Sport);

public record GetStandingsQuery(string? Sport = null) : IRequest<List<TeamDto>>;

public class GetStandingsHandler(AppDbContext db) : IRequestHandler<GetStandingsQuery, List<TeamDto>>
{
    public async Task<List<TeamDto>> Handle(GetStandingsQuery q, CancellationToken ct)
    {
        var query = db.Teams.AsNoTracking();
        if (!string.IsNullOrEmpty(q.Sport))
            query = query.Where(t => t.Sport == q.Sport);

        var teams = await query.ToListAsync(ct);
        return teams
            .Select(t => new TeamDto(t.Id, t.Name, t.Sport, t.Wins, t.Losses, t.Draws, t.Points))
            .OrderByDescending(t => t.Points)
            .ThenByDescending(t => t.Wins)
            .ToList();
    }
}

public record CreateTeamCommand(CreateTeamRequest Request) : IRequest<Guid>;

public class CreateTeamHandler(AppDbContext db) : IRequestHandler<CreateTeamCommand, Guid>
{
    public async Task<Guid> Handle(CreateTeamCommand cmd, CancellationToken ct)
    {
        var team = Team.Create(cmd.Request.Name, cmd.Request.Sport);
        db.Teams.Add(team);
        await db.SaveChangesAsync(ct);
        return team.Id;
    }
}

public static class TeamsEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/v1/teams/standings", async (string? sport, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetStandingsQuery(sport), ct)))
            .WithName("GetStandings").WithTags("Teams").Produces<List<TeamDto>>();

        app.MapPost("/api/v1/teams", async (CreateTeamRequest req, ISender sender, CancellationToken ct) =>
        {
            var id = await sender.Send(new CreateTeamCommand(req), ct);
            return Results.Created($"/api/v1/teams/{id}", new { id });
        })
        .WithName("CreateTeam").WithTags("Teams");
    }
}
