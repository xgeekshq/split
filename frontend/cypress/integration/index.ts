describe('I am at landing page and I see the projects name', () => {
	it('should work', () => {
		cy.visit('http://localhost:3000');
		cy.url().should('include', '/');
		cy.get('div').should('contain', 'Divide and conquer');
	});
});

export default {};
