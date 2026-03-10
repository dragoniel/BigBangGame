using BigBangGame.Application.DTOs;
using BigBangGame.Domain.Entities;

namespace BigBangGame.Application.Queries;

/// <summary>
/// Returns all game choices.
/// </summary>
public static class GetChoicesQuery
{
    public sealed class Handler
    {
        /// <summary>
        /// No dependencies needed — the choice list is a static domain constant.
        /// The handler still lives in Application so the controller has no reason
        /// to import the Domain layer directly.
        /// </summary>
        public IReadOnlyList<ChoiceDto> Handle() =>
            Choice.All.Select(c => new ChoiceDto(c.Id, c.Name)).ToList();
    }
}
