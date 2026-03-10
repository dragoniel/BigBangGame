using FluentAssertions;
using BigBangGame.Domain.Entities;
using BigBangGame.Domain.Exceptions;
using Xunit;

namespace BigBangGame.Domain.Tests;

public sealed class ChoiceTests
{
    [Fact]
    public void All_ContainsFiveChoices() =>
        Choice.All.Should().HaveCount(5);

    [Theory]
    [InlineData(ChoiceType.Rock,     1, "Rock")]
    [InlineData(ChoiceType.Paper,    2, "Paper")]
    [InlineData(ChoiceType.Scissors, 3, "Scissors")]
    [InlineData(ChoiceType.Lizard,   4, "Lizard")]
    [InlineData(ChoiceType.Spock,    5, "Spock")]
    public void From_ReturnsCorrectChoice(ChoiceType choice, int expectedId, string expectedName)
    {
        ((int)choice).Should().Be(expectedId);
        choice.ToString().Should().Be(expectedName);
    }

    [Theory]
    [InlineData(1)]
    [InlineData(5)]
    public void From_NotThrowsInvalidChoiceException_ForValidId(int id)
    {
        var act = () => Choice.From(id);
        act.Should().NotThrow<InvalidChoiceException>();
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    [InlineData(-1)]
    [InlineData(99)]
    public void From_ThrowsInvalidChoiceException_ForInvalidId(int id)
    {
        var act = () => Choice.From(id);
        act.Should().Throw<InvalidChoiceException>();
    }

    [Fact]
    public void InvalidChoiceException_ContainsId()
    {
        var act = () => Choice.From(42);
        act.Should().Throw<InvalidChoiceException>()
           .WithMessage("*42*");
    }
}
