import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Logo from "./Logo";

describe("Logo Component", () => {
  test("renders without crashing", () => {
    render(<Logo />);

    expect(screen.getByText("MOVIEO")).toBeInTheDocument();
  });
});
