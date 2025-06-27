import { Button } from "@/components/atoms/Button";

describe("alias test", () => {
  it("importe un composant via @ alias", () => {
    expect(Button).toBeDefined();
  });
});
