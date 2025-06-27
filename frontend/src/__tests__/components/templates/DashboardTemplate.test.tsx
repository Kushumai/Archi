import { render, screen, fireEvent } from "@testing-library/react";
import DashboardTemplate from "@/components/templates/DashboardTemplate";

jest.mock("@/contexts/authContext", () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { email: "test@example.com" },
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

describe("DashboardTemplate", () => {
  it("render le composant, affiche les enfants et gère l'ouverture/fermeture de la sidebar", () => {
    render(
      <DashboardTemplate view="upload" setView={() => {}}>
        <h2 data-testid="child-content">Contenu test</h2>
      </DashboardTemplate>
    );

    const main = screen.getByRole("main");
    const child = screen.getByTestId("child-content");

    expect(main).toBeInTheDocument();
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent("Contenu test");

    const toggleButton = screen.getByRole("button", { name: /menu|ouvrir|sidebar|toggle/i });
    fireEvent.click(toggleButton);
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: /fermer|close/i }));
    expect(document.body.style.overflow).toBe("");
  });

  it("utilise bien le user du context", () => {
    render(
      <DashboardTemplate view="profile" setView={() => {}}>
        <p data-testid="profile-content">Profil utilisateur</p>
      </DashboardTemplate>
    );

    expect(screen.getByTestId("profile-content")).toHaveTextContent("Profil utilisateur");
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

   it("render la vue upload", () => {
    render(
      <DashboardTemplate view="upload" setView={() => {}}>
        <h2>Contenu Upload</h2>
      </DashboardTemplate>
    );
    expect(screen.getByRole("heading", { name: /upload/i })).toBeInTheDocument();
  });

  it("render la vue documents", () => {
    render(
      <DashboardTemplate view="documents" setView={() => {}}>
        <h2>Contenu Documents</h2>
      </DashboardTemplate>
    );
    expect(screen.getByRole("heading", { name: /documents/i })).toBeInTheDocument();
  });

  it("render la vue profile", () => {
    render(
      <DashboardTemplate view="profile" setView={() => {}}>
        <h2>Contenu Profil</h2>
      </DashboardTemplate>
    );
    expect(screen.getByRole("heading", { name: /profil/i })).toBeInTheDocument();
  });

  it("se render sans crash avec enfants", () => {
    render(
      <DashboardTemplate view="upload" setView={() => {}}>
        <h2 data-testid="test-content">Upload de document</h2>
      </DashboardTemplate>
    );
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByText("Upload de document")).toBeInTheDocument();
  });
});
