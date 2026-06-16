namespace SportTrack.Api.Domain.Entities;

public class Match
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string HomeTeam { get; private set; } = default!;
    public string AwayTeam { get; private set; } = default!;
    public int HomeScore { get; private set; }
    public int AwayScore { get; private set; }
    public string Sport { get; private set; } = default!;
    public MatchStatus Status { get; private set; } = MatchStatus.Scheduled;
    public DateTime MatchDate { get; private set; }
    public string Venue { get; private set; } = default!;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; private set; } = DateTime.UtcNow;

    private Match() { }

    public static Match Create(string homeTeam, string awayTeam, string sport, DateTime matchDate, string venue)
        => new()
        {
            HomeTeam = homeTeam,
            AwayTeam = awayTeam,
            Sport = sport,
            MatchDate = matchDate,
            Venue = venue,
        };

    public void UpdateScore(int homeScore, int awayScore)
    {
        HomeScore = homeScore;
        AwayScore = awayScore;
        UpdatedAt = DateTime.UtcNow;
    }

    public void UpdateStatus(MatchStatus status)
    {
        Status = status;
        UpdatedAt = DateTime.UtcNow;
    }
}

public enum MatchStatus
{
    Scheduled,
    Live,
    Finished
}
