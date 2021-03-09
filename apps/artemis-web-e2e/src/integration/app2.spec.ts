import Chance from 'chance';

let newEmail;
let newPass;

describe('artemis-web', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('remember_me', 'sid', 'access_token');
  });

  it('logs in with ldap', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Sign In');
    cy.typeLogin({ email: 'hermes@planetexpress.com', password: 'hermes' });
    cy.loginLDAP();
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
  });

  it('after login > Dashboard', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.visit('/dashboard');
    cy.wait(2000);
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
    cy.get('#modules').find('tr').its('length').should('be.gt', 0);
  });

  it('diplays modules', () => {
    cy.visit('/dashboard');
    cy.wait(2000);
    // Custom command example, see `../support/commands.ts` file
    cy.get('#modules').find('tr').its('length').should('be.gt', 0);
  });
});
