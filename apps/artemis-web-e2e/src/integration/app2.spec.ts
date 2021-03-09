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
    cy.get('h1').should('have.text', 'Login');
    cy.typeLogin({ email: 'hermes@planetexpress.com', password: 'hermes' });
    cy.loginLDAP();
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
  });

  it('change password', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.visit('/password_change');
    cy.wait(2000);
    cy.typeChangePass({
      old_pass: newPass,
      new_pass: '1234',
      repeat_pass: '1234',
    });
    cy.get('#submit').click();
    cy.wait(1000);
    cy.get('#password_change_form').contains('has been updated');
  });

  it('logs out', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.get('#logout', { timeout: 4000 }).click({ force: true });
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Login');
  });

  it('logs in with ldap', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Login');
    cy.typeLogin({ email: 'hermes@planetexpress.com', password: 'hermes' });
    cy.loginLDAP();
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
  });
});
