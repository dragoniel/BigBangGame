using Microsoft.AspNetCore.Mvc;
using BigBangGame.Application.DTOs;
using BigBangGame.Application.Queries;

namespace BigBangGame.WebApi.Controllers
{
    [ApiController]
    [Route("api")]
    [Produces("application/json")]
    public sealed class ChoicesController(
        GetChoicesQuery.Handler getChoicesHandler,
        GetRandomChoiceQuery.Handler getRandomChoiceHandler) : ControllerBase
    {
        /// <summary>
        /// Returns all choices available in the game.
        /// </summary>
        [HttpGet("choices")]
        [ProducesResponseType<IEnumerable<ChoiceDto>>(StatusCodes.Status200OK)]
        public IActionResult GetChoices()
        {
            var result = getChoicesHandler.Handle();
            return Ok(result);
        }

        /// <summary>Returns a single randomly selected choice.</summary>
        [HttpGet("choice")]
        [ProducesResponseType<ChoiceDto>(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetRandomChoice(CancellationToken ct)
        {
            var choice = await getRandomChoiceHandler.HandleAsync(ct);
            return Ok(choice);
        }
    }
}
