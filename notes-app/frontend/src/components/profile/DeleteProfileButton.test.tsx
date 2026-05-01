import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import DeleteProfileButton from "./DeleteProfileButton";
import { useUserContext } from "../../contexts/user.context";

vi.mock("../../contexts/user.context", () => ({
  useUserContext: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("DeleteProfileButton", () => {
  const mockDeleteUser = vi.fn();
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (useUserContext as any).mockReturnValue({
      deleteUser: mockDeleteUser,
      logout: mockLogout,
    });
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <DeleteProfileButton />
      </BrowserRouter>,
    );

  it("1. click and got confirm deletion", () => {
    renderComponent();

    // Initially "Delete Account" button is visible
    const initialDeleteBtn = screen.getByRole("button", {
      name: /Delete Account/i,
    });
    fireEvent.click(initialDeleteBtn);

    // Confirmation dialog appears
    expect(screen.getByText(/Are you absolutely sure/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Yes, delete my account/i }),
    ).toBeInTheDocument();
  });

  it("2. cancel deletion", () => {
    renderComponent();

    // Open confirmation
    fireEvent.click(screen.getByRole("button", { name: /Delete Account/i }));

    // Click Cancel
    fireEvent.click(screen.getByRole("button", { name: /Cancel/i }));

    // Confirm dialog disappears and initial button returns
    expect(
      screen.queryByText(/Are you absolutely sure/i),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Delete Account/i }),
    ).toBeInTheDocument();
  });

  it("3. click and confirm deletion: pass case", async () => {
    mockDeleteUser.mockResolvedValue({ success: true });
    mockLogout.mockResolvedValue(undefined);
    renderComponent();

    // Open and confirm
    fireEvent.click(screen.getByRole("button", { name: /Delete Account/i }));
    fireEvent.click(
      screen.getByRole("button", { name: /Yes, delete my account/i }),
    );

    await waitFor(() => {
      expect(mockDeleteUser).toHaveBeenCalledTimes(1);
      expect(window.alert).toHaveBeenCalledWith(
        "Account deleted successfully!",
      );
      expect(mockLogout).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});
