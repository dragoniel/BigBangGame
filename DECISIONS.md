# Technical Decisions 

# Backend

For the backend I chose a `Clean Architecture` to demonstrate the benefits it provides even at small scale. The four layers enforce `separation of concerns` and clear dependency rules, making the application more testable and maintainable.

### The Four Layers

**Domain** is the innermost layer with zero NuGet dependencies. It contains all pure game logic. Hardcoded string values are avoided in favour of enums, making the code more robust against typos and easier to extend if new choices are added in the future.

**Application** contains one handler class per use case, grouped into Commands (state-changing) and Queries (read-only) — a lightweight expression of the `CQRS pattern` at the handler level. Handlers are kept as straightforward classes rather than using the `MediatR` library; at five use cases, direct injection is more explicit and easier to follow. I also chose not to use `AutoMapper` for DTO mapping: at this scale, manual mapping is more explicit, fully type-safe, and avoids the runtime indirection AutoMapper introduces. I would revisit both MediatR and Automapper decisions if the project grew significantly.

**Infrastructure** provides the concrete implementations of the interfaces defined in Domain. Two implementations live here: An in-memory Scoreboard repository and the call to the Random Number Provider. Both `IScoreboardRepository` and `IRandomProvider` are defined in Domain and implemented in Infrastructure — Domain has no knowledge that Infrastructure exists. The in-memory repository uses the `lock` keyword to ensure thread safety, which is necessary because the repository is registered as a singleton and its internal list is shared mutable state across concurrent HTTP requests. Replacing it with an `EF Core` implementation would require only one class in Infrastructure, Application and Domain are untouched. Similarly, the external random service can be replaced or stubbed without any changes to Application or Domain.

**Api** is deliberately thin. Controllers translate HTTP verbs into handler calls and map results to HTTP status codes. `Cancellation tokens` are threaded through to all async operations so that if a client disconnects mid-request, work stops immediately and resources are freed. Domain exceptions (`InvalidChoiceException`) are caught at the controller boundary and mapped to appropriate HTTP responses, keeping the controllers focused and keeping validation logic where it belongs — in the domain. The one deliberate exception to the "Api knows nothing about Infrastructure" rule is `Program.cs`, which is the composition root — the single place in the codebase where all layers are wired together via `Dependency Injection`.

# Frontend

Plain React with no state-management library. The component tree is shallow enough that prop drilling is fine, and adding Redux would be premature. 
The `api.js` is a thin module that wraps `fetch` calls. Keeping all HTTP logic there means the components never know about URLs or error shapes — if the API changes, there's only one file to update.
Custom hook with game logic, to keep the components clean, focused on presentation and easy unit testing. 

## Testing

### Backend

Unit tests cover:

- Every permutation of the win/lose/tie matrix (all 25 combinations)
- Scoreboard behaviour: add, cap at 10, newest-first ordering, reset
- The random-number-to-choice-id mapping for all 100 possible inputs

Tests are written with `xUnit` and `FluentAssertions` for readable `Should().Be()` assertions.

### Frontend

Unit tests cover the behaviour of each component — verifying the correct data is displayed, user interactions trigger the right callbacks, and accessibility attributes are set correctly. Written with `Jest` and `React Testing Library`, testing through the rendered DOM rather than implementation details.

## AI Tooling

I used `Claude` and `GitHub Copilot` to help explore different approaches and generate candidate implementations across multiple iterations of the application. However, I reviewed every single line of output, evaluated the trade-offs of each approach, selected the best solution, and manually tuned the final code. All architectural decisions, structural choices, and judgement calls described in this document are my own.
I also used `Nano Banana` to generate a Sheldon image for the UI, using a blurred cartoonish drawing found online as a visual reference.

## What I'd Add With More Time

- **Logging middleware**: A simple middleware to capture unhandled exceptions alongside request details (method, path, status code). This is the most immediate production readiness gap.
- **Persistence**: SQLite via EF Core for a scoreboard that survives restarts — a one-class addition in Infrastructure.
- **Integration and E2E tests**: Integration tests using `WebApplicationFactory` to test the full HTTP stack, and Playwright for end-to-end tests covering the complete user flow.
- **Animations and sound**: Simple animations before and after the result reveal and sound effects to make the game more engaging.   
- **CSS refactoring**: Migrate the stylesheet to SASS or LESS to leverage variables, nesting, and mixins, and audit the existing rules to remove duplication introduced during AI-assisted development.
