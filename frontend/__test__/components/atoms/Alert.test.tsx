import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "@/components/atoms/Alert";

describe("Alert", () => {
  it("affiche le titre et la description", () => {
    render(<Alert title="Erreur" description="Une erreur est survenue" variant="error" />);
    expect(screen.getByText("Erreur")).toBeInTheDocument();
    expect(screen.getByText("Une erreur est survenue")).toBeInTheDocument();
  });

  it("a le rôle 'alert' pour l'accessibilité", () => {
    render(<Alert title="Erreur" variant="error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("appelle onClose quand on clique sur le bouton ✕", () => {
    const handleClose = jest.fn();
    render(<Alert title="Fermable" variant="error" dismissible onClose={handleClose} />);
    const closeButton = screen.getByRole("button", { name: /fermer/i });
    fireEvent.click(closeButton);
    expect(handleClose).toHaveBeenCalled();
  });
});