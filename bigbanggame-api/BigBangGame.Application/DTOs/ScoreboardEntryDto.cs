namespace BigBangGame.Application.DTOs
{
    public sealed record ScoreboardEntryDto(
        string PlayerChoice,
        string ComputerChoice,
        string Result,
        DateTime PlayedAt
    );
}
