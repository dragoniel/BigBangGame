using BigBangGame.Domain.Entities;

namespace BigBangGame.Domain.Interfaces
{
    public interface IScoreboardRepository
    {
        /// <summary>
        ///  Returns the most recent game rounds, newest first.
        /// </summary>
        /// <returns>List of scoreboard entries</returns>
        IReadOnlyList<ScoreboardEntry> GetRecent();

        /// <summary>
        /// Stores a completed game round.
        /// </summary>
        void Add(ScoreboardEntry entry);

        /// <summary>
        /// Removes all entries.
        /// </summary>
        void Clear();
    }
}
