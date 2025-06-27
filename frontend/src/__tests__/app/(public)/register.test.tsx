import { render, screen, fireEvent } from "@testing-library/react";
import RegisterPage from "@/app/(public)/register/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/register",
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

describe("RegisterPage", () => {
  it("affiche tous les champs requis", () => {
    render(<RegisterPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/prénom/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Nom *")).toBeInTheDocument();
    expect(screen.getByLabelText(/mot de passe/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /s’inscrire/i })).toBeInTheDocument();
  });

  it("affiche un message d’erreur si les champs sont vides", () => {
    render(<RegisterPage />);
    fireEvent.click(screen.getByRole("button", { name: /s’inscrire/i }));
    expect(screen.getByText(/veuillez remplir tous les champs obligatoires/i)).toBeInTheDocument();
  });
});