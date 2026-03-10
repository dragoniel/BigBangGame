namespace BigBangGame.Domain.Interfaces
{
    public interface IRandomProvider
    {
        /// <summary>
        /// Retrieves a random number from the third-party service. 1 - 100
        /// Falls back to a local RNG if the external service is unavailable,
        /// </summary>
        /// <param name="ct">A cancellation token that can be used to cancel the asynchronous operation.</param>
        /// <returns>A task that represents the asynchronous operation. The task result contains a randomly generated integer.</returns>
        Task<int> GetRandomNumberAsync(CancellationToken ct = default);
    }
}
