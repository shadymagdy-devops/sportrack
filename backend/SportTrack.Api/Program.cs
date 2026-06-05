using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SportTrack.Api.Common;
using SportTrack.Api.Features.Matches.CreateMatch;
using SportTrack.Api.Features.Matches.GetMatches;
using SportTrack.Api.Features.Matches.UpdateScore;
using SportTrack.Api.Features.Players;
using SportTrack.Api.Features.Teams;
using SportTrack.Api.Infrastructure.Persistence;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

// Serilog
builder.Host.UseSerilog((ctx, cfg) =>
    cfg.ReadFrom.Configuration(ctx.Configuration)
       .WriteTo.Console());

// Database
builder.Services.AddDbContext<AppDbContext>(opts =>
    opts.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// MediatR + Validators
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblyContaining<Program>());
builder.Services.AddValidatorsFromAssemblyContaining<Program>();
builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

// Exception Handler
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// CORS - allow React dev server
builder.Services.AddCors(opts => opts.AddPolicy("React", p =>
    p.WithOrigins("http://localhost:3000", "http://localhost:80")
     .AllowAnyHeader()
     .AllowAnyMethod()));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c => c.SwaggerDoc("v1", new() { Title = "SportTrack API", Version = "v1" }));

var app = builder.Build();

// Middleware pipeline
app.UseExceptionHandler();
app.UseCors("React");
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Auto-migrate on startup (dev only — use proper migration runner in prod)
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Health check
app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }))
   .WithTags("Health");

// Register all endpoints
GetMatchesEndpoint.Map(app);
CreateMatchEndpoint.Map(app);
UpdateScoreEndpoint.Map(app);
UpdateStatusEndpoint.Map(app);
DeleteMatchEndpoint.Map(app);
PlayersEndpoints.Map(app);
TeamsEndpoints.Map(app);

app.Run();
