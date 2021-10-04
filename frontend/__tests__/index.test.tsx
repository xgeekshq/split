import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../pages/index";

describe("Landing page", () => {
  it("renders a div", () => {
    render(<Home />);

    const div = screen.getByText("Divide and conquer");

    expect(div).toBeInTheDocument();
  });
});
