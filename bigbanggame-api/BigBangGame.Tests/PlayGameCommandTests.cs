using FluentAssertions;
using NSubstitute;
using BigBangGame.Application.Commands;
using BigBangGame.Domain.Entities;
using BigBangGame.Domain.Exceptions;
using BigBangGame.Domain.Interfaces;
using Xunit;

namespace BigBangGame.Application.Tests.Commands;

public sealed class PlayGameCommandTests
{
    private readonly IRandomProvider _randomProvider   = Substitute.For<IRandomProvider>();
    private readonly IScoreboardRepository _repository = Substitute.For<IScoreboardRepository>();

    private PlayGameCommand.Handler CreateHandler() =>
        new(_randomProvider, _repository);

    // RNG values 1-5 map to choices 1-5; 6→1, 10→5, etc.
    private void SetupRng(int value) =>
        _randomProvider.GetRandomNumberAsync(default).ReturnsForAnyArgs(value);

    [Fact]
    public async Task Handle_ReturnsWin_WhenPlayerBeatsComputer()
    {
        // Rock (1) beats Scissors (3). RNG value 3 → computerId 3.
        SetupRng(3);
        var result = await CreateHandler().HandleAsync(new(Player: 1));
        result.Results.Should().Be("win");
    }

    [Fact]
    public async Task Handle_ReturnsLose_WhenComputerBeatsPlayer()
    {
        // Rock (1) loses to Paper (2). RNG value 2 → computerId 2.
        SetupRng(2);
        var result = await CreateHandler().HandleAsync(new(Player: 1));
        result.Results.Should().Be("lose");
    }

    [Fact]
    public async Task Handle_ReturnsTie_WhenSameChoice()
    {
        // Rock (1) vs Rock (1). RNG value 1 → computerId 1.
        SetupRng(1);
        var result = await CreateHandler().HandleAsync(new(Player: 1));
        result.Results.Should().Be("tie");
    }

    [Fact]
    public async Task Handle_ReturnsCorrectPlayerAndComputerIds()
    {
        SetupRng(3); // computer = scissors (3)
        var result = await CreateHandler().HandleAsync(new(Player: 1));
        result.Player.Should().Be(1);
        result.Computer.Should().Be(3);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(6)]
    [InlineData(-1)]
    public async Task Handle_ThrowsInvalidChoiceException_ForInvalidPlayerId(int invalidId)
    {
        SetupRng(1);
        var act = () => CreateHandler().HandleAsync(new(Player: invalidId));
        await act.Should().ThrowAsync<InvalidChoiceException>();
    }

    [Theory]
    [InlineData(1,   1)] // 1  → choice 1
    [InlineData(5,   5)] // 5  → choice 5
    [InlineData(6,   1)] // 6  → choice 1 (wraps)
    [InlineData(10,  5)] // 10 → choice 5
    [InlineData(100, 5)] // 100 → choice 5
    public async Task Handle_MapsRngToChoiceCorrectly(int rngValue, int expectedComputerId)
    {
        SetupRng(rngValue);
        var result = await CreateHandler().HandleAsync(new(Player: 1));
        result.Computer.Should().Be(expectedComputerId);
    }
}
