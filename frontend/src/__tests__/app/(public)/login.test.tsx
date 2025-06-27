import { render, screen } from "@testing-library/react";
import LoginPage from "@/app/(public)/login/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/login",
}));

jest.mock("@/contexts/authContext", () => ({
  useAuth: () => ({
    isAuthenticated: false,
    loading: false,
    logout: jest.fn(),
    login: jest.fn(),
    user: null,
  }),
}));

describe("LoginPage", () => {
  it("affiche les champs email et mot de passe", () => {
    render(<LoginPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
  });
});