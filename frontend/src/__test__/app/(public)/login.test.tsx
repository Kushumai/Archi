import  "@/__test__/__mocks__/MockUseRouter";

import { render, screen } from "@testing-library/react";
import { TestProviders } from "@/__test__/providers/TestProviders";
import LoginPage from "@/app/(public)/login/page";


describe("LoginPage", () => {
  it("affiche les champs email et mot de passe", () => {
    render(
      <TestProviders>
        <LoginPage />
      </TestProviders>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });
});
