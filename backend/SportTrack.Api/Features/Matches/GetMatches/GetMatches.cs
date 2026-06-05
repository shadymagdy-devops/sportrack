using MediatR;
using Microsoft.EntityFrameworkCore;
using SportTrack.Api.Infrastructure.Persistence;

namespace SportTrack.Api.Features.Matches.GetMatches;

// --- DTOs ---
public record MatchDto(
    Guid Id,
    string HomeTeam,
    string AwayTeam,
    int HomeScore,
    int AwayScore,
    string Sport,
    string Status,
    DateTime MatchDate,
    string Venue
);

// --- Query ---
public record GetMatchesQuery(string? Sport = null, string? Status = null) : IRequest<List<MatchDto>>;

// --- Handler ---
public class GetMatchesHandler(AppDbContext db) : IRequestHandler<GetMatchesQuery, List<MatchDto>>
{
    public async Task<List<MatchDto>> Handle(GetMatchesQuery q, CancellationToken ct)
    {
        var query = db.Matches.AsNoTracking();

        if (!string.IsNullOrEmpty(q.Sport))
            query = query.Where(m => m.Sport == q.Sport);

        if (!string.IsNullOrEmpty(q.Status) && Enum.TryParse<Domain.Entities.MatchStatus>(q.Status, true, out var status))
            query = query.Where(m => m.Status == status);

        return await query
            .OrderByDescending(m => m.MatchDate)
            .Select(m => new MatchDto(m.Id, m.HomeTeam, m.AwayTeam, m.HomeScore, m.AwayScore,
                m.Sport, m.Status.ToString().ToLower(), m.MatchDate, m.Venue))
            .ToListAsync(ct);
    }
}

// --- Endpoint ---
public static class GetMatchesEndpoint
{
    public static void Map(WebApplication app)
    {
        app.MapGet("/api/v1/matches", async (
            string? sport,
            string? status,
            ISender sender,
            CancellationToken ct) =>
        {
            var result = await sender.Send(new GetMatchesQuery(sport, status), ct);
            return Results.Ok(result);
        })
        .WithName("GetMatches")
        .WithTags("Matches")
        .Produces<List<MatchDto>>();
    }
}
