using Microsoft.AspNetCore.Mvc;
using BigBangGame.Application.Commands;
using BigBangGame.Application.DTOs;
using BigBangGame.Application.Queries;
using BigBangGame.Domain.Exceptions;

namespace BigBangGame.WebApi.Controllers
{
    [ApiController]
    [Route("api")]
    [Produces("application/json")]
    public sealed class GameController(
    PlayGameCommand.Handler playHandler,
    GetScoreboardQuery.Handler getScoreboardHandler,
    ResetScoreboardCommand.Handler resetHandler) : ControllerBase
    {
        /// <summary>
        /// Play a round against the computer.
        /// </summary>
        [HttpPost("play")]
        [ProducesResponseType<PlayResultDto>(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Play([FromBody] PlayRequestDto request, CancellationToken ct)
        {
            try
            {
                var result = await playHandler.HandleAsync(request, ct);
                return Ok(result);
            }
            catch (InvalidChoiceException ex)
            {
                // Domain exceptions are mapped to HTTP status codes here in the Api layer,
                return BadRequest(new { error = ex.Message });
            }
        }

        /// <summary>
        /// Returns the 10 most recent results.
        /// </summary>
        [HttpGet("scoreboard")]
        [ProducesResponseType<IEnumerable<ScoreboardEntryDto>>(StatusCodes.Status200OK)]
        public IActionResult GetScoreboard()
        {
            var result = getScoreboardHandler.Handle();
            return Ok(result);
        }

        /// <summary>
        /// Clears the scoreboard.
        /// </summary>
        [HttpDelete("scoreboard")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        public IActionResult ResetScoreboard()
        {
            resetHandler.Handle();
            return NoContent();
        }
    }
}