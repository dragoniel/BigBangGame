using BigBangGame.Application.Commands;
using BigBangGame.Application.Queries;
using BigBangGame.Domain.Interfaces;
using BigBangGame.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddTransient<GetChoicesQuery.Handler>();
builder.Services.AddTransient<GetRandomChoiceQuery.Handler>();
builder.Services.AddTransient<GetScoreboardQuery.Handler>();
builder.Services.AddTransient<PlayGameCommand.Handler>();
builder.Services.AddTransient<ResetScoreboardCommand.Handler>();

builder.Services.AddSingleton<IScoreboardRepository, InMemoryScoreboardRepository>();
builder.Services.AddHttpClient<IRandomProvider, ExternalRandomProvider>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddCors(opts =>
    opts.AddDefaultPolicy(p =>
        p.AllowAnyOrigin()
         .AllowAnyHeader()
         .AllowAnyMethod()));

var app = builder.Build();

app.UseCors();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "Swagger"));
}

app.MapControllers();

app.Run();
