import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ChoiceButton } from "../../components/ChoiceButton";
import type { Choice } from "../../types";

const rockChoice: Choice = { id: 1, name: "rock" };
const spockChoice: Choice = { id: 5, name: "spock" };

describe("ChoiceButton", () => {
  it("renders the choice name", () => {
    render(
      <ChoiceButton
        choice={rockChoice}
        selected={false}
        disabled={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByText("rock")).toBeInTheDocument();
  });

  it("uses the choice name as its accessible label", () => {
    render(
      <ChoiceButton
        choice={spockChoice}
        selected={false}
        disabled={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "spock" })).toBeInTheDocument();
  });

  it("calls onClick with the choice when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <ChoiceButton
        choice={rockChoice}
        selected={false}
        disabled={false}
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: "rock" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(rockChoice);
  });

  it("is disabled when the disabled prop is true", () => {
    render(
      <ChoiceButton
        choice={rockChoice}
        selected={false}
        disabled={true}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "rock" })).toBeDisabled();
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <ChoiceButton
        choice={rockChoice}
        selected={false}
        disabled={true}
        onClick={handleClick}
      />,
    );

    await user.click(screen.getByRole("button", { name: "rock" }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("has aria-pressed=true when selected", () => {
    render(
      <ChoiceButton
        choice={rockChoice}
        selected={true}
        disabled={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "rock" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("has aria-pressed=false when not selected", () => {
    render(
      <ChoiceButton
        choice={rockChoice}
        selected={false}
        disabled={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "rock" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("applies the selected CSS class when selected", () => {
    render(
      <ChoiceButton
        choice={rockChoice}
        selected={true}
        disabled={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "rock" })).toHaveClass("selected");
  });

  it("does not apply the selected CSS class when not selected", () => {
    render(
      <ChoiceButton
        choice={rockChoice}
        selected={false}
        disabled={false}
        onClick={jest.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: "rock" })).not.toHaveClass("selected");
  });
});
