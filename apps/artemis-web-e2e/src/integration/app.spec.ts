import Chance from 'chance';

let newEmail;
let newPass;

describe('artemis-web', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('remember_me', 'sid');
    cy.visit('/');
  });

  it('signs up a new user', () => {
    cy.visit('/signup');
    const chance = new Chance();
    newEmail = chance.email();
    newPass = chance.string({ length: 5 });
    const name = chance.first();
    cy.typeRegister({ name: name, email: newEmail, password: newPass });
    cy.register();
  });

  it('logs out', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.get('#logout', { timeout: 4000 }).click({ force: true });
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Sign in');
  });

  it('logs in', () => {
    cy.get('h1').should('have.text', 'Sign in');
    cy.typeLogin({ email: newEmail, password: newPass });
    cy.login();
  });

  it('after login > Dashboard', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
    cy.get('#modules').find('tr').its('length').should('be.gt', 0);
  });

  it('diplays modules', () => {
    // Custom command example, see `../support/commands.ts` file
    cy.get('#modules').find('tr').its('length').should('be.gt', 0);
  });
});
