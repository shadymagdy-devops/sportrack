using FluentValidation;
using MediatR;
using SportTrack.Api.Domain.Entities;
using SportTrack.Api.Infrastructure.Persistence;

namespace SportTrack.Api.Features.Matches.CreateMatch;

// --- Request ---
public record CreateMatchRequest(
    string HomeTeam,
    string AwayTeam,
    string Sport,
    DateTime MatchDate,
    string Venue
);

// --- Command ---
public record CreateMatchCommand(CreateMatchRequest Request) : IRequest<Guid>;

// --- Validator ---
public class CreateMatchValidator : AbstractValidator<CreateMatchCommand>
{
    public CreateMatchValidator()
    {
        RuleFor(x => x.Request.HomeTeam).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Request.AwayTeam).NotEmpty().MaximumLength(100)
            .NotEqual(x => x.Request.HomeTeam).WithMessage("Home and Away teams must be different.");
        RuleFor(x => x.Request.Sport).NotEmpty().MaximumLength(50);
        RuleFor(x => x.Request.Venue).NotEmpty().MaximumLength(200);
        RuleFor(x => x.Request.MatchDate).GreaterThan(DateTime.UtcNow.AddMinutes(-5));
    }
}

// --- Handler ---
public class CreateMatchHandler(AppDbContext db) : IRequestHandler<CreateMatchCommand, Guid>
{
    public async Task<Guid> Handle(CreateMatchCommand cmd, CancellationToken ct)
    {
        var match = Match.Create(
            cmd.Request.HomeTeam,
            cmd.Request.AwayTeam,
            cmd.Request.Sport,
            cmd.Request.MatchDate,
            cmd.Request.Venue
        );

        db.Matches.Add(match);
        await db.SaveChangesAsync(ct);
        return match.Id;
    }
}

// --- Endpoint ---
public static class CreateMatchEndpoint
{
    public static void Map(WebApplication app)
    {
        app.MapPost("/api/v1/matches", async (
            CreateMatchRequest request,
            ISender sender,
            CancellationToken ct) =>
        {
            var id = await sender.Send(new CreateMatchCommand(request), ct);
            return Results.CreatedAtRoute("GetMatches", null, new { id });
        })
        .WithName("CreateMatch")
        .WithTags("Matches")
        .Produces(StatusCodes.Status201Created)
        .ProducesValidationProblem();
    }
}
