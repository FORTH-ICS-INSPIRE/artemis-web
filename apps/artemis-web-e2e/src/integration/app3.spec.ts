describe('artemis-web', () => {
    beforeEach(() => {
        Cypress.Cookies.preserveOnce('remember_me', 'sid', 'access_token');
    });

    it('[LDAP] admin logs in', () => {
        cy.visit('/login');
        cy.get('h1').should('have.text', 'Sign In');
        cy.typeLogin({ email: 'hermes@planetexpress.com', password: 'hermes' });
        cy.loginLDAP();
        cy.waitFor('h1');
        cy.get('h1').should('have.text', 'Dashboard');
    });

    it('[LDAP] admin visits User Management Page', () => {
        cy.visit('/admin/user_management');
        cy.waitFor('h1');
        cy.get('h1').should('have.text', 'User Management');

        cy.get('#approval').click({ force: true });
        cy.wait(1000);
    });

});
