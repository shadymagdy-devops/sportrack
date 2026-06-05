using MediatR;
using Microsoft.EntityFrameworkCore;
using SportTrack.Api.Domain.Entities;
using SportTrack.Api.Infrastructure.Persistence;

namespace SportTrack.Api.Features.Matches.UpdateScore;

// --- UpdateScore ---
public record UpdateScoreRequest(int HomeScore, int AwayScore);
public record UpdateScoreCommand(Guid MatchId, int HomeScore, int AwayScore) : IRequest<bool>;

public class UpdateScoreHandler(AppDbContext db) : IRequestHandler<UpdateScoreCommand, bool>
{
    public async Task<bool> Handle(UpdateScoreCommand cmd, CancellationToken ct)
    {
        var match = await db.Matches.FindAsync([cmd.MatchId], ct);
        if (match is null) return false;
        match.UpdateScore(cmd.HomeScore, cmd.AwayScore);
        await db.SaveChangesAsync(ct);
        return true;
    }
}

public static class UpdateScoreEndpoint
{
    public static void Map(WebApplication app)
    {
        app.MapPatch("/api/v1/matches/{id:guid}/score", async (
            Guid id,
            UpdateScoreRequest req,
            ISender sender,
            CancellationToken ct) =>
        {
            var ok = await sender.Send(new UpdateScoreCommand(id, req.HomeScore, req.AwayScore), ct);
            return ok ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateScore")
        .WithTags("Matches");
    }
}

// --- UpdateStatus ---
public record UpdateStatusRequest(string Status);
public record UpdateStatusCommand(Guid MatchId, MatchStatus Status) : IRequest<bool>;

public class UpdateStatusHandler(AppDbContext db) : IRequestHandler<UpdateStatusCommand, bool>
{
    public async Task<bool> Handle(UpdateStatusCommand cmd, CancellationToken ct)
    {
        var match = await db.Matches.FindAsync([cmd.MatchId], ct);
        if (match is null) return false;
        match.UpdateStatus(cmd.Status);
        await db.SaveChangesAsync(ct);
        return true;
    }
}

public static class UpdateStatusEndpoint
{
    public static void Map(WebApplication app)
    {
        app.MapPatch("/api/v1/matches/{id:guid}/status", async (
            Guid id,
            UpdateStatusRequest req,
            ISender sender,
            CancellationToken ct) =>
        {
            if (!Enum.TryParse<MatchStatus>(req.Status, true, out var status))
                return Results.BadRequest("Invalid status. Use: scheduled, live, finished");

            var ok = await sender.Send(new UpdateStatusCommand(id, status), ct);
            return ok ? Results.NoContent() : Results.NotFound();
        })
        .WithName("UpdateStatus")
        .WithTags("Matches");
    }
}

// --- DeleteMatch ---
public record DeleteMatchCommand(Guid MatchId) : IRequest<bool>;

public class DeleteMatchHandler(AppDbContext db) : IRequestHandler<DeleteMatchCommand, bool>
{
    public async Task<bool> Handle(DeleteMatchCommand cmd, CancellationToken ct)
    {
        var match = await db.Matches.FindAsync([cmd.MatchId], ct);
        if (match is null) return false;
        db.Matches.Remove(match);
        await db.SaveChangesAsync(ct);
        return true;
    }
}

public static class DeleteMatchEndpoint
{
    public static void Map(WebApplication app)
    {
        app.MapDelete("/api/v1/matches/{id:guid}", async (
            Guid id,
            ISender sender,
            CancellationToken ct) =>
        {
            var ok = await sender.Send(new DeleteMatchCommand(id), ct);
            return ok ? Results.NoContent() : Results.NotFound();
        })
        .WithName("DeleteMatch")
        .WithTags("Matches");
    }
}
