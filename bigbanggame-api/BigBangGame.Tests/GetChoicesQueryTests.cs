using FluentAssertions;
using BigBangGame.Application.Queries;
using Xunit;

namespace BigBangGame.Application.Tests.Queries;

public sealed class GetChoicesQueryTests
{
    private static GetChoicesQuery.Handler CreateHandler() => new();

    [Fact]
    public void Handle_ReturnsFiveChoices() =>
        CreateHandler().Handle().Should().HaveCount(5);

    [Fact]
    public void Handle_ReturnsCorrectNames()
    {
        var names = CreateHandler().Handle().Select(c => c.Name);
        names.Should().BeEquivalentTo(["rock", "paper", "scissors", "lizard", "spock"]);
    }

    [Fact]
    public void Handle_ReturnsIdsOneToFive()
    {
        var ids = CreateHandler().Handle().Select(c => c.Id);
        ids.Should().BeEquivalentTo([1, 2, 3, 4, 5]);
    }
}
