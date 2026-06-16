using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SportTrack.Api.Domain.Entities;

namespace SportTrack.Api.Infrastructure.Persistence.Configurations;

public class MatchConfiguration : IEntityTypeConfiguration<Match>
{
    public void Configure(EntityTypeBuilder<Match> builder)
    {
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(m => m.HomeTeam).IsRequired().HasMaxLength(100);
        builder.Property(m => m.AwayTeam).IsRequired().HasMaxLength(100);
        builder.Property(m => m.Sport).IsRequired().HasMaxLength(50);
        builder.Property(m => m.Venue).IsRequired().HasMaxLength(200);
        builder.Property(m => m.Status).HasConversion<string>();
        builder.Property(m => m.MatchDate).HasColumnType("timestamptz");
        builder.Property(m => m.CreatedAt).HasColumnType("timestamptz");
        builder.Property(m => m.UpdatedAt).HasColumnType("timestamptz");
        builder.HasIndex(m => m.Status);
        builder.HasIndex(m => m.MatchDate);
        builder.ToTable("matches");
    }
}

public class PlayerConfiguration : IEntityTypeConfiguration<Player>
{
    public void Configure(EntityTypeBuilder<Player> builder)
    {
        builder.HasKey(p => p.Id);
        builder.Property(p => p.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(p => p.Name).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Team).IsRequired().HasMaxLength(100);
        builder.Property(p => p.Position).IsRequired().HasMaxLength(50);
        builder.Property(p => p.Sport).IsRequired().HasMaxLength(50);
        builder.HasIndex(p => p.Team);
        builder.ToTable("players");
    }
}

public class TeamConfiguration : IEntityTypeConfiguration<Team>
{
    public void Configure(EntityTypeBuilder<Team> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Id).HasDefaultValueSql("gen_random_uuid()");
        builder.Property(t => t.Name).IsRequired().HasMaxLength(100);
        builder.Property(t => t.Sport).IsRequired().HasMaxLength(50);
        builder.Ignore(t => t.Points); // computed, not stored
        builder.HasIndex(t => new { t.Sport, t.Name }).IsUnique();
        builder.ToTable("teams");
    }
}
