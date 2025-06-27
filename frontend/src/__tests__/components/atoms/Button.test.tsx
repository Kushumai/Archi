import { render } from "@testing-library/react";
import { Button } from "@/components/atoms/Button";

describe("Button", () => {
  it("se render sans crash", () => {
    render(<Button>Test</Button>);
  });
});