using BigBangGame.Domain.Interfaces;

namespace BigBangGame.Application.Commands;

/// <summary>
/// Clears all scoreboard entries.
/// </summary>
public static class ResetScoreboardCommand
{
    public sealed class Handler(IScoreboardRepository repository)
    {
        public void Handle() => repository.Clear();
    }
}
