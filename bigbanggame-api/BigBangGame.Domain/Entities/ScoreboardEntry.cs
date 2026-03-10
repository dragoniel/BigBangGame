namespace BigBangGame.Domain.Entities
{
    public record ScoreboardEntry(
        ChoiceType PlayerChoice,
        ChoiceType ComputerChoice,
        GameOutcome Result,
        DateTime PlayedAt
    );
}
