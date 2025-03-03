import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import SearchBar from "./SearchBar";

describe("SearchBar Component", () => {
  test("renders input field and reset button", () => {
    const setQuery = vi.fn();
    render(<SearchBar setQuery={setQuery} />);

    expect(
      screen.getByPlaceholderText("Search for movies...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Reset search" })
    ).toBeInTheDocument();
  });

  test("triggers setQuery when input changes with valid query", () => {
    const setQuery = vi.fn();
    render(<SearchBar setQuery={setQuery} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "Interstellar" } });

    expect(setQuery).toHaveBeenCalledWith("Interstellar");
  });

  test("shows warning for queries less than 3 characters", () => {
    const setQuery = vi.fn();
    render(<SearchBar setQuery={setQuery} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "In" } });

    expect(
      screen.getByText("Enter at least 3 characters.")
    ).toBeInTheDocument();
    expect(setQuery).not.toHaveBeenCalled();
  });

  test("hides warning when entering valid query", () => {
    const setQuery = vi.fn();
    render(<SearchBar setQuery={setQuery} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "In" } });

    expect(
      screen.getByText("Enter at least 3 characters.")
    ).toBeInTheDocument();

    fireEvent.change(input, { target: { value: "Inception" } });

    expect(
      screen.queryByText("Enter at least 3 characters.")
    ).not.toBeInTheDocument();
    expect(setQuery).toHaveBeenCalledWith("Inception");
  });

  test("clears input and resets warning on reset button click", () => {
    const setQuery = vi.fn();
    render(<SearchBar setQuery={setQuery} />);

    const input = screen.getByPlaceholderText("Search for movies...");
    fireEvent.change(input, { target: { value: "Interstellar" } });

    const resetButton = screen.getByRole("button", { name: "Reset search" });
    fireEvent.click(resetButton);

    expect(setQuery).toHaveBeenCalledWith("");
    expect(
      screen.queryByText("Enter at least 3 characters.")
    ).not.toBeInTheDocument();
  });
});
