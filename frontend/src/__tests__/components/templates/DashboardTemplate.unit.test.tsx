// src/__tests__/components/organisms/Header.unit.test.tsx
import { render, screen } from "@testing-library/react";
import { Header } from "@/components/organisms/Header";

// Mock Next.js App Router hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    forward: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

// Préparer un mock dynamique de useAuth
const createUseAuthMock = (isAuthenticated: boolean) => () => ({
  isAuthenticated,
  logout: jest.fn(),
  loading: false,
  user: { email: "test@example.com" },
});

describe("Header", () => {
  beforeEach(() => {
    jest.resetModules(); // Important pour réinitialiser les mocks
  });

  it("se render sans crash", () => {
    jest.doMock("@/contexts/authContext", () => ({
      useAuth: createUseAuthMock(false),
    }));

    const { Header: MockedHeader } = require("@/components/organisms/Header");
    render(<MockedHeader />);
    expect(screen.getByText("Archi")).toBeInTheDocument();
  });

  it("affiche le bouton 'Entrer' si non connecté", () => {
    jest.doMock("@/contexts/authContext", () => ({
      useAuth: createUseAuthMock(false),
    }));

    const { Header: MockedHeader } = require("@/components/organisms/Header");
    render(<MockedHeader />);
    expect(screen.getByRole("button")).toHaveTextContent("Entrer");
  });

  it("affiche le bouton 'Sortir' si connecté", () => {
    jest.doMock("@/contexts/authContext", () => ({
      useAuth: createUseAuthMock(true),
    }));

    const { Header: MockedHeader } = require("@/components/organisms/Header");
    render(<MockedHeader />);
    expect(screen.getByRole("button")).toHaveTextContent("Sortir");
  });
});
