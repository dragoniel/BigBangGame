namespace BigBangGame.Domain.Entities;

/// <summary>
/// Encapsulates the Rock-Paper-Scissors-Lizard-Spock game rules.
///
/// Win matrix (what each choice BEATS):
///   Rock     → Scissors, Lizard
///   Paper    → Rock, Spock
///   Scissors → Paper, Lizard
///   Lizard   → Paper, Spock
///   Spock    → Rock, Scissors
/// </summary>
public sealed class GameRound
{
    // Maps each choice to the choices it defeats.
    private static readonly IReadOnlyDictionary<ChoiceType, HashSet<ChoiceType>> WinMap =
        new Dictionary<ChoiceType, HashSet<ChoiceType>>
        {
            [ChoiceType.Rock]     = [ChoiceType.Scissors, ChoiceType.Lizard],
            [ChoiceType.Paper]    = [ChoiceType.Rock,     ChoiceType.Spock],
            [ChoiceType.Scissors] = [ChoiceType.Paper,    ChoiceType.Lizard],
            [ChoiceType.Lizard]   = [ChoiceType.Paper,    ChoiceType.Spock],
            [ChoiceType.Spock]    = [ChoiceType.Rock,     ChoiceType.Scissors],
        };

    /// <summary>
    /// Determines the outcome of a game round by comparing the player's choice with the computer's choice.
    /// </summary>
    /// <param name="playerChoice">The choice made by the player.</param>
    /// <param name="computerChoice">The choice made by the computer.</param>
    /// <returns>A GameOutcome value indicating whether the player wins, loses, or ties the game.</returns>
    public static GameOutcome Play(ChoiceType playerChoice, ChoiceType computerChoice)
    {
        if (playerChoice == computerChoice)
        {
            return GameOutcome.Tie;
        }
        return WinMap[playerChoice].Contains(computerChoice) ? GameOutcome.Win : GameOutcome.Lose;
    }
}
