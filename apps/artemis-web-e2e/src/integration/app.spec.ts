import Chance from 'chance';

let newEmail;
let newPass;

describe('artemis-web', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce(
      'remember_me',
      'sid',
      'access_token',
      'XSRF-TOKEN'
    );
  });

  it('signs up a new user', () => {
    cy.visit('/signup');
    const chance = new Chance();
    newEmail = chance.email();
    newPass = chance.string({ length: 5 });
    const name = chance.first();
    cy.typeRegister({ name: name, email: newEmail, password: newPass });
    cy.register();
    cy.wait(1000);
    cy.get('h1').should('have.text', 'Pending Approval');
  });

  it('logs out', () => {
    cy.visit('/pending');
    // Custom command example, see `../support/commands.ts` file
    cy.get('#logout', { timeout: 2000 }).click({ force: true });
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Sign In');
  });

  it('logs in', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Sign In');
    cy.typeLogin({ email: newEmail, password: newPass });
    cy.login();
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Pending Approval');
  });
});
