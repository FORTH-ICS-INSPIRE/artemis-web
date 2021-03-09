import Chance from 'chance';

let newEmail;
let newPass;

describe('artemis-web', () => {
  beforeEach(() => {
    Cypress.Cookies.preserveOnce('remember_me', 'sid', 'access_token');
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
    cy.visit('/dashboard');
    // Custom command example, see `../support/commands.ts` file
    cy.get('#logout', { timeout: 2000 }).click({ force: true });
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Login');
  });

  it('logs in', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Login');
    cy.typeLogin({ email: newEmail, password: newPass });
    cy.login();
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
