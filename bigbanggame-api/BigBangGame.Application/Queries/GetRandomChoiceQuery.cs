using BigBangGame.Application.DTOs;
using BigBangGame.Domain.Entities;
using BigBangGame.Domain.Interfaces;

namespace BigBangGame.Application.Queries;

/// <summary>
/// Returns a single randomly selected choice using the external Random service.
/// </summary>
public static class GetRandomChoiceQuery
{
    public sealed class Handler(IRandomProvider randomProvider)
    {
        public async Task<ChoiceDto> HandleAsync(CancellationToken ct = default)
        {
            var number = await randomProvider.GetRandomNumberAsync(ct);
            var choice = Choice.GetFromRandomNumber(number);
            return new ChoiceDto((int)choice, choice.ToString().ToLower());
        }
    }
}
