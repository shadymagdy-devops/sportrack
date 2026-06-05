using MediatR;
using Microsoft.EntityFrameworkCore;
using SportTrack.Api.Domain.Entities;
using SportTrack.Api.Infrastructure.Persistence;

namespace SportTrack.Api.Features.Players;

// --- DTOs ---
public record PlayerDto(Guid Id, string Name, string Team, string Position, string Sport, int Goals, int Assists, int Points);
public record CreatePlayerRequest(string Name, string Team, string Position, string Sport);

// --- GetPlayers ---
public record GetPlayersQuery(string? Team = null) : IRequest<List<PlayerDto>>;

public class GetPlayersHandler(AppDbContext db) : IRequestHandler<GetPlayersQuery, List<PlayerDto>>
{
    public async Task<List<PlayerDto>> Handle(GetPlayersQuery q, CancellationToken ct)
    {
        var query = db.Players.AsNoTracking();
        if (!string.IsNullOrEmpty(q.Team))
            query = query.Where(p => p.Team == q.Team);

        return await query
            .OrderBy(p => p.Name)
            .Select(p => new PlayerDto(p.Id, p.Name, p.Team, p.Position, p.Sport, p.Goals, p.Assists, p.Points))
            .ToListAsync(ct);
    }
}

// --- CreatePlayer ---
public record CreatePlayerCommand(CreatePlayerRequest Request) : IRequest<Guid>;

public class CreatePlayerHandler(AppDbContext db) : IRequestHandler<CreatePlayerCommand, Guid>
{
    public async Task<Guid> Handle(CreatePlayerCommand cmd, CancellationToken ct)
    {
        var player = Player.Create(cmd.Request.Name, cmd.Request.Team, cmd.Request.Position, cmd.Request.Sport);
        db.Players.Add(player);
        await db.SaveChangesAsync(ct);
        return player.Id;
    }
}

// --- Endpoints ---
public static class PlayersEndpoints
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/v1/players", async (string? team, ISender sender, CancellationToken ct) =>
            Results.Ok(await sender.Send(new GetPlayersQuery(team), ct)))
            .WithName("GetPlayers").WithTags("Players").Produces<List<PlayerDto>>();

        app.MapPost("/api/v1/players", async (CreatePlayerRequest req, ISender sender, CancellationToken ct) =>
        {
            var id = await sender.Send(new CreatePlayerCommand(req), ct);
            return Results.Created($"/api/v1/players/{id}", new { id });
        })
        .WithName("CreatePlayer").WithTags("Players");
    }
}
