namespace BigBangGame.Domain.Exceptions;

/// <summary>
/// Thrown when a caller supplies a choice ID that does not correspond to any
/// of the valid choices. 
/// </summary>
public sealed class InvalidChoiceException(int id)
    : Exception($"'{id}' is not a valid choice id.");
