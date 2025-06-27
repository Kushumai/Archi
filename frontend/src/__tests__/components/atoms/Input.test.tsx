import { render } from "@testing-library/react";
import Input from "@/components/atoms/Input";

describe("Input", () => {
  it("se render sans crash", () => {
    render(<Input id="test" type="text" />);
  });
});