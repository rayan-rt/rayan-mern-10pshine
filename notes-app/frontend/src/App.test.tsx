import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";
// --

describe("App Component", () => {
  it("should render the app title", () => {
    render(<App />);
    const titleElement = screen.getByText(/Rayan 10pshine Notes taking App/i);
    expect(titleElement).toBeInTheDocument();
  });
});
