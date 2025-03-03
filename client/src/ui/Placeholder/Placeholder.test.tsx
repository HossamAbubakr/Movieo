import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Placeholder from "./Placeholder";

describe("Placeholder Component", () => {
  test("renders without crashing", () => {
    render(<Placeholder heading="Test Heading" message="Test Message" />);

    expect(screen.getByText("Test Heading")).toBeInTheDocument();
    expect(screen.getByText("Test Message")).toBeInTheDocument();
  });

  test("renders correct heading and message", () => {
    render(<Placeholder heading="Error" message="Something went wrong" />);

    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  test("handles dynamic props correctly", () => {
    const heading = "No Results";
    const message = "Try searching for a different movie.";

    render(<Placeholder heading={heading} message={message} />);

    expect(screen.getByText(heading)).toBeInTheDocument();
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
