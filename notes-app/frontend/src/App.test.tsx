import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import App from "./App";

vi.mock("./contexts/user.context", () => ({
  useUserContext: vi.fn().mockReturnValue({ user: null, loading: false }),
}));

describe("App Component", () => {
  it("should render the app", () => {
    render(<App />);
    expect(document.body).toBeInTheDocument();
  });
});
