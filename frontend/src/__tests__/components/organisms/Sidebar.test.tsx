import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "@/components/organisms/Sidebar";

describe("Sidebar", () => {
  const setView = jest.fn();
  const onOpen = jest.fn();
  const onClose = jest.fn();
  const user = { email: "test@example.com" };

  it("rend les boutons et l’email quand le menu est ouvert", () => {
    render(
      <Sidebar
        view="upload"
        setView={setView}
        user={user}
        isOpen={true}
        onOpen={onOpen}
        onClose={onClose}
      />
    );

    expect(screen.getByLabelText("Fermer le menu")).toBeInTheDocument();
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Profil")).toBeInTheDocument();
    expect(screen.getByText(user.email)).toBeInTheDocument();
  });

  it("cache les éléments si isOpen = false", () => {
    render(
      <Sidebar
        view="upload"
        setView={setView}
        user={user}
        isOpen={false}
        onOpen={onOpen}
        onClose={onClose}
      />
    );

    expect(screen.getByLabelText("Ouvrir le menu")).toBeInTheDocument();
    expect(screen.getByText("Upload").closest("nav")).toHaveClass("hidden");
    expect(screen.queryByText(user.email)).not.toBeInTheDocument();
  });

  it("déclenche setView sur clic sur 'Documents'", () => {
    render(
      <Sidebar
        view="upload"
        setView={setView}
        user={user}
        isOpen={true}
        onOpen={onOpen}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByText("Documents"));
    expect(setView).toHaveBeenCalledWith("documents");
  });

  it("déclenche onClose si menu ouvert", () => {
    render(
      <Sidebar
        view="upload"
        setView={setView}
        user={user}
        isOpen={true}
        onOpen={onOpen}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByLabelText("Fermer le menu"));
    expect(onClose).toHaveBeenCalled();
  });

  it("déclenche onOpen si menu fermé", () => {
    render(
      <Sidebar
        view="upload"
        setView={setView}
        user={user}
        isOpen={false}
        onOpen={onOpen}
        onClose={onClose}
      />
    );

    fireEvent.click(screen.getByLabelText("Ouvrir le menu"));
    expect(onOpen).toHaveBeenCalled();
  });
});
