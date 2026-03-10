using BigBangGame.Application.DTOs;
using BigBangGame.Domain.Interfaces;

namespace BigBangGame.Application.Queries;

/// <summary>
/// Returns the most recent game results.
/// </summary>
public static class GetScoreboardQuery
{
    public sealed class Handler(IScoreboardRepository repository)
    {
        public IReadOnlyList<ScoreboardEntryDto> Handle()
        {
            var entries = repository
                .GetRecent()
                .Select(r => new ScoreboardEntryDto(
                    PlayerChoice:   r.PlayerChoice.ToString().ToLower(),
                    ComputerChoice: r.ComputerChoice.ToString().ToLower(),
                    Result:         r.Result.ToString().ToLower(),
                    PlayedAt:       r.PlayedAt
                ))
                .ToList();

            return entries;
        }
    }
}
