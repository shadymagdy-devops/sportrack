namespace SportTrack.Api.Domain.Entities;

public class Team
{
    public Guid Id { get; private set; } = Guid.NewGuid();
    public string Name { get; private set; } = default!;
    public string Sport { get; private set; } = default!;
    public int Wins { get; private set; }
    public int Losses { get; private set; }
    public int Draws { get; private set; }
    public int Points => (Wins * 3) + Draws;
    public DateTime CreatedAt { get; private set; } = DateTime.UtcNow;

    private Team() { }

    public static Team Create(string name, string sport)
        => new() { Name = name, Sport = sport };

    public void RecordResult(bool won, bool draw)
    {
        if (won) Wins++;
        else if (draw) Draws++;
        else Losses++;
    }
}
