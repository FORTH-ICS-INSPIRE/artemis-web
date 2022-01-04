describe('artemis-web', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('remember_me', 'sid', 'access_token');
    });

    it('[ACCESS] login page check', () => {
        cy.visit('/login');
        cy.injectAxe();
        cy.checkA11y();
    });
});
