import { render, screen } from "@testing-library/react";
import DashboardPage from "@/app/(protected)/dashboard/page";

jest.mock("@/contexts/authContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    loading: false,
    logout: jest.fn(),
    user: { email: "test@example.com" },
  }),
}));

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => "/dashboard",
}));

jest.mock("@/hooks/useDocuments", () => ({
  useDocuments: () => ({
    docs: [],
    fetchDocs: jest.fn(),
    uploading: false,
    uploadDocument: jest.fn(),
    deleting: false,
    deleteDocument: jest.fn(),
  }),
}));

describe("DashboardPage", () => {
  it("se render sans crash et affiche la vue 'upload'", () => {
    render(<DashboardPage />);
    
    expect(
      screen.getByRole("heading", { name: /upload de document/i })
    ).toBeInTheDocument();
  });
});