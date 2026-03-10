using BigBangGame.Domain.Entities;
using BigBangGame.Domain.Interfaces;

namespace BigBangGame.Infrastructure;

/// <summary>
/// In-memory implementation of <see cref="IScoreboardRepository"/>.
///
/// Registered as a singleton so state persists for the application lifetime.
/// The <see cref="Lock"/> ensures thread-safety under concurrent requests.
///
/// Trade-off: state is lost on restart. Replacing this with a durable
/// implementation (e.g. EF Core + SQLite) requires only a new class that
/// implements the same interface — no changes needed in Domain or Application.
/// </summary>
public sealed class InMemoryScoreboardRepository : IScoreboardRepository
{
    private readonly List<ScoreboardEntry> _entries = new(capacity: 10);
    private readonly Lock _lock = new();

    public IReadOnlyList<ScoreboardEntry> GetRecent()
    {
        lock (_lock)
        {
            return _entries.AsReadOnly();
        }
    }

    public void Add(ScoreboardEntry round)
    {
        lock (_lock)
        {
            _entries.Insert(0, round);
            if (_entries.Count > 10)
            {
                _entries.RemoveAt(10);
            }
        }
    }

    public void Clear()
    {
        lock (_lock)
            _entries.Clear();
    }
}
