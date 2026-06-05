namespace SportTrack.Api.Domain.Entities;

public class Player
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Name { get; private set; } = default!;
    public string Team { get; private set; } = default!;
    public string Position { get; private set; } = default!;
    public string Sport { get; private set; } = default!;
    public int Goals { get; private set; }
    public int Assists { get; private set; }
    public int Points { get; private set; }
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private Player() { }

    public static Player Create(string name, string team, string position, string sport)
        => new() { Name = name, Team = team, Position = position, Sport = sport };

    public void UpdateStats(int goals, int assists, int points)
    {
        Goals = goals;
        Assists = assists;
        Points = points;
    }
}
