Cypress.Commands.add('login', (
    user = Cypress.env('user_name'),
    password = Cypress.env('user_password'),
) => {
    	cy.visit('');
        cy.get('//*[@id="menuUserLink"]').click();
        cy.get('').type(user);
        cy.get('').type(password);
        cy.get('').click();
});