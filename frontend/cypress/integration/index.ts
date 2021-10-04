describe("index page with text 'Divide and conquer'", () => {
  it("should work", () => {
    cy.visit("http://localhost:3000");
    cy.url().should("include", "/");
    cy.get("div").should("contain", "Divide and conquer");
  });
});
