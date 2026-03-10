using BigBangGame.Domain.Interfaces;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace BigBangGame.Infrastructure;

public sealed class ExternalRandomProvider(HttpClient http, ILogger<ExternalRandomProvider> logger) : IRandomProvider
{
    public async Task<int> GetRandomNumberAsync(CancellationToken ct = default)
    {
        try
        {
            var response = await http.GetFromJsonAsync<RandomResponse>(
                "https://codechallenge.boohma.com/random", ct);

            if (response != null &&
                response.random_number is >= 1 and <= 100)
            {
                return response.random_number;
            }
            logger.LogWarning("External Random service returned an unexpected value; falling back to local.");
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "External Random service call failed; falling back to local.");
        }

        //The maximum value 101 is exclusive → it will never return 101
        return Random.Shared.Next(1, 101);
    }
}
