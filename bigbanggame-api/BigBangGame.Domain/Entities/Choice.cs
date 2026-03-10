using BigBangGame.Domain.Exceptions;

namespace BigBangGame.Domain.Entities;

public record Choice(int Id, string Name)
{
    /// <summary>
    /// Gets a read-only list of all available choices defined by the ChoiceType enumeration.
    /// </summary>
    public static IReadOnlyList<Choice> All
    {
        get
        {
            // Generate the list of choices from the ChoiceType enum, ensuring it stays in sync.
            var choices = Enum.GetValues<ChoiceType>().Select(id => new Choice((int)id, id.ToString().ToLower()));
            return choices.ToList().AsReadOnly();
        }
    }

    /// <summary>
    /// Retrieves a ChoiceType that corresponds to the specified choice id.
    /// </summary>
    /// <param name="choiceId">The unique identifier of the choice to retrieve. Must match an existing choice.</param>
    /// <returns>The ChoiceType associated with the specified identifier.</returns>
    /// <exception cref="InvalidChoiceException">Thrown if the specified choice identifier does not correspond to any existing choice.</exception>
    public static ChoiceType From(int choiceId)
    {
        var res = All.FirstOrDefault(c => c.Id == choiceId);
        if (res == null)
        {
            throw new InvalidChoiceException((int)choiceId);
        }
        return (ChoiceType)res.Id;
    }

    /// <summary>
    /// Maps the specified random number to a corresponding ChoiceType value in the range of 1 to 5.
    /// </summary>
    /// <param name="randomNumber">The random number to map. Must be a positive integer greater than 0.</param>
    /// <returns>A ChoiceType value that corresponds to the provided random number.</returns>
    public static ChoiceType GetFromRandomNumber(int randomNumber) 
    {
       var choiceId = (randomNumber - 1) % 5 + 1; // Map random number to a value between 1 and 5
        return From(choiceId);
    }
}
