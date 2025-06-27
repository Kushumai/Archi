import { render, screen } from "@testing-library/react";
import { Footer } from "@/components/organisms/Footer";

describe("Footer", () => {
  it("se render sans crash", () => {
    render(<Footer />);
    expect(
    screen.getByText((content) => content.includes("Archi"))).toBeInTheDocument();
  });

  it("affiche tous les liens importants", () => {
    render(<Footer />);
    expect(screen.getByText(/à propos/i)).toBeInTheDocument();
    expect(screen.getByText(/contact/i)).toBeInTheDocument();
    expect(screen.getByText(/mentions légales/i)).toBeInTheDocument();
    expect(screen.getByText(/politique de confidentialité/i)).toBeInTheDocument();
  });

  it("affiche l’année actuelle dans le copyright", () => {
    render(<Footer />);
    expect(screen.getByText(`© ${new Date().getFullYear()} Archi — Tous droits réservés.`)).toBeInTheDocument();
  });
});
