import { render, screen } from "@testing-library/react";
import { Sidebar } from "@/components/organisms/Sidebar";

jest.mock("@/lib/utils", () => ({
  cn: (...args: string[]) => args.filter(Boolean).join(" "),
}));

describe("Sidebar", () => {
  it("s'affiche avec les boutons visibles si isOpen = true", () => {
    render(
      <Sidebar
        view="upload"
        setView={() => {}}
        user={{ email: "test@example.com" }}
        isOpen={true}
        onOpen={() => {}}
        onClose={() => {}}
      />
    );

    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.getByText("Documents")).toBeInTheDocument();
    expect(screen.getByText("Profil")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});