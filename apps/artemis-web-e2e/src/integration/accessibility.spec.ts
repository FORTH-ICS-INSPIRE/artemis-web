describe('artemis-web', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('remember_me', 'sid', 'access_token');
    });

    it('[ACCESS] login page check', () => {
        cy.visit('/login');
        cy.injectAxe();
        cy.wait(2000);
        cy.checkA11y();
    });

    it('[ACCESS] signup page check', () => {
        cy.visit('/signup');
        cy.injectAxe();
        cy.wait(2000);
        cy.checkA11y();
    });
});
