import { render, screen } from "@testing-library/react";

let isAuthenticated = false;

jest.mock("@/contexts/authContext", () => ({
  useAuth: () => ({
    isAuthenticated,
    user: isAuthenticated ? { email: "test@example.com" } : null,
    logout: jest.fn(),
    loading: false,
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

import { Header } from "@/components/organisms/Header";

describe("Header", () => {
  beforeEach(() => {
    isAuthenticated = false;
  });

  it("affiche Entrer si l'utilisateur n'est pas connecté", () => {
    render(<Header />);
    expect(screen.getByRole("button")).toHaveTextContent("Entrer");
  });

  it("affiche Sortir si l'utilisateur est connecté", () => {
    isAuthenticated = true;
    render(<Header />);
    expect(screen.getByRole("button")).toHaveTextContent("Sortir");
  });
});
