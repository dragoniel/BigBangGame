using BigBangGame.Application.DTOs;
using BigBangGame.Domain.Entities;
using BigBangGame.Domain.Exceptions;
using BigBangGame.Domain.Interfaces;

namespace BigBangGame.Application.Commands;

/// <summary>
/// Plays a single round: resolves the player choice, picks a computer choice
/// via the Random service, gets the play outcoume and stores a Scoreboard entry, and returns the result DTO.
/// </summary>
public static class PlayGameCommand
{
    public sealed class Handler(
        IRandomProvider randomProvider,
        IScoreboardRepository scoreboardRepository)
    {
        public async Task<PlayResultDto> HandleAsync(PlayRequestDto request, CancellationToken ct = default)
        {
            // Validate and resolve the player's choice.
            // Choice.From throws InvalidChoiceException for invalid ids,
            // which the Api layer maps to 400 Bad Request.
            var playerChoice = Choice.From(request.Player);

            // Resolve computer choice via the injected Random service.
            var randomNumber   = await randomProvider.GetRandomNumberAsync(ct);
            var computerChoice = Choice.GetFromRandomNumber(randomNumber);

            // gets the result from the gameround
            var result = GameRound.Play(playerChoice, computerChoice);

            scoreboardRepository.Add(new ScoreboardEntry(playerChoice, computerChoice, result, DateTime.UtcNow));

            return new PlayResultDto(
                Results:  result.ToString().ToLower(),
                Player:   (int)playerChoice,
                Computer: (int)computerChoice
            );
        }
    }
}
