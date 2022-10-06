describe('artemis-web', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('remember_me', 'sid', 'access_token');
  });

  it('[LDAP] admin logs in', () => {
    cy.visit('/login');
    cy.get('h1').should('have.text', 'Sign In');
    cy.typeLogin({ email: 'hermes@planetexpress.com', password: 'hermes' });
    cy.wait(2000);
    cy.loginLDAP();
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
  });

  it('[LDAP] admin visits System page', () => {
    cy.visit('/admin/system');
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'System');
  });


  it('[LDAP] admin logs out', () => {
    cy.visit('/dashboard');
    cy.get('#logout', { timeout: 2000 }).click({ force: true });
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Sign In');
  });

  it('[LDAP] user logs in', () => {
    cy.visit('/login');
    cy.get('h1').should('have.text', 'Sign In');
    cy.typeLogin({ email: 'fry@planetexpress.com', password: 'fry' });
    cy.wait(2000);
    cy.loginLDAP();
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
  });

  it('[LDAP] user logs out', () => {
    cy.visit('/dashboard');
    cy.get('#logout', { timeout: 2000 }).click({ force: true });
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Sign In');
  });
});
