using FluentAssertions;
using BigBangGame.Domain.Entities;
using Xunit;

namespace BigBangGame.Domain.Tests;

/// <summary>
/// Tests for GameRound outcome determination.
///
/// Win matrix (player → beats):
///   Rock     → Scissors, Lizard
///   Paper    → Rock,     Spock
///   Scissors → Paper,    Lizard
///   Lizard   → Paper,    Spock
///   Spock    → Rock,     Scissors
/// </summary>
public sealed class GameRoundTests
{
    // ── Ties ─────────────────────────────────────────────────────────────────

    [Theory]
    [InlineData(ChoiceType.Rock)]
    [InlineData(ChoiceType.Paper)]
    [InlineData(ChoiceType.Scissors)]
    [InlineData(ChoiceType.Lizard)]
    [InlineData(ChoiceType.Spock)]
    public void SameChoice_AlwaysTies(ChoiceType choice) =>
        GameRound.Play(choice, choice).Should().Be(GameOutcome.Tie);

    // ── Rock ─────────────────────────────────────────────────────────────────

    [Theory]
    [InlineData(ChoiceType.Scissors)]
    [InlineData(ChoiceType.Lizard)]
    public void Rock_Beats(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Rock, computer).Should().Be(GameOutcome.Win);

    [Theory]
    [InlineData(ChoiceType.Paper)]
    [InlineData(ChoiceType.Spock)]
    public void Rock_LosesTo(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Rock, computer).Should().Be(GameOutcome.Lose);

    // ── Paper ────────────────────────────────────────────────────────────────

    [Theory]
    [InlineData(ChoiceType.Rock)]
    [InlineData(ChoiceType.Spock)]
    public void Paper_Beats(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Paper, computer).Should().Be(GameOutcome.Win);

    [Theory]
    [InlineData(ChoiceType.Scissors)]
    [InlineData(ChoiceType.Lizard)]
    public void Paper_LosesTo(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Paper, computer).Should().Be(GameOutcome.Lose);

    // ── Scissors ─────────────────────────────────────────────────────────────

    [Theory]
    [InlineData(ChoiceType.Paper)]
    [InlineData(ChoiceType.Lizard)]
    public void Scissors_Beats(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Scissors, computer).Should().Be(GameOutcome.Win);

    [Theory]
    [InlineData(ChoiceType.Rock)]
    [InlineData(ChoiceType.Spock)]
    public void Scissors_LosesTo(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Scissors, computer).Should().Be(GameOutcome.Lose);

    // ── Lizard ────────────────────────────────────────────────────────────────

    [Theory]
    [InlineData(ChoiceType.Paper)]
    [InlineData(ChoiceType.Spock)]
    public void Lizard_Beats(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Lizard, computer).Should().Be(GameOutcome.Win);

    [Theory]
    [InlineData(ChoiceType.Rock)]
    [InlineData(ChoiceType.Scissors)]
    public void Lizard_LosesTo(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Lizard, computer).Should().Be(GameOutcome.Lose);

    // ── Spock ─────────────────────────────────────────────────────────────────

    [Theory]
    [InlineData(ChoiceType.Rock)]
    [InlineData(ChoiceType.Scissors)]
    public void Spock_Beats(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Spock, computer).Should().Be(GameOutcome.Win);

    [Theory]
    [InlineData(ChoiceType.Paper)]
    [InlineData(ChoiceType.Lizard)]
    public void Spock_LosesTo(ChoiceType computer) =>
        GameRound.Play(ChoiceType.Spock, computer).Should().Be(GameOutcome.Lose);

    // ── Antisymmetry ──────────────────────────────────────────────────────────

    [Fact]
    public void WinMatrix_IsAntisymmetric()
    {
        var choices = Enum.GetValues<ChoiceType>();
        foreach (var a in choices)
        foreach (var b in choices)
        {
            if (a == b) continue;
            var ab = GameRound.Play(a, b);
            var ba = GameRound.Play(b, a);
            if (ab == GameOutcome.Win)
                ba.Should().Be(GameOutcome.Lose, $"{b} should lose to {a}");
            else
                ba.Should().Be(GameOutcome.Win, $"{b} should beat {a}");
        }
    }
}
