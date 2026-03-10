using FluentAssertions;
using NSubstitute;
using BigBangGame.Application.Queries;
using BigBangGame.Domain.Entities;
using BigBangGame.Domain.Interfaces;
using Xunit;

namespace BigBangGame.Application.Tests.Queries;

public sealed class GetScoreboardQueryTests
{
    private readonly IScoreboardRepository _repository = Substitute.For<IScoreboardRepository>();

    private GetScoreboardQuery.Handler CreateHandler() => new(_repository);

    private static GameOutcome MakeRound(ChoiceType player, ChoiceType computer) =>
        GameRound.Play(player, computer);

    [Fact]
    public void Handle_ReturnsEmptyList_WhenRepositoryIsEmpty()
    {
        _repository.GetRecent();
        var result = CreateHandler().Handle();
        result.Should().BeEmpty();
    }
}
