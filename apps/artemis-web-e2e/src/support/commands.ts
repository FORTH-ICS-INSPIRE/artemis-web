// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
// eslint-disable-next-line @typescript-eslint/no-namespace
declare namespace Cypress {
  interface Chainable<Subject> {
    typeLogin(user: any): void;
    login(): void;
    register(): void;
    typeRegister(user: any): void;
    loginLDAP(): void;
    typeChangePass(user: any): void;
  }
}
//
// -- This is a parent command --
Cypress.Commands.add('typeLogin', (user) => {
  cy.get('body').then(($body) => {
    // synchronously query from body
    // to find which element was created
    if ($body.find('input[name=email]').length) {
      cy.get('input[name=email]').type(user.email);

      cy.get('input[name=password]').type(user.password);

      cy.get('input[type=checkbox]').click({force: true});
    }
  });
});

Cypress.Commands.add('typeRegister', (user) => {
  cy.get('#username').type(user.name);
  cy.get('#email').type(user.email);
  cy.get('#password').type(user.password);
});

Cypress.Commands.add('typeChangePass', (user) => {
  cy.get('#old_password').type(user.old_pass);
  cy.get('#new_password').type(user.new_pass);
  cy.get('#repeat_password').type(user.repeat_pass);
});

Cypress.Commands.add('register', () => {
  cy.get('button[type=submit]').click();
  cy.wait(1000);
});

Cypress.Commands.add('login', () => {
  cy.get('body').then(($body) => {
    // synchronously query from body
    // to find which element was created
    if ($body.find('input[name=email]').length) {
      cy.get('button[type=submit]').click({force: true});
      cy.wait(1000);
    }
  });
});

Cypress.Commands.add('loginLDAP', () => {
  cy.get('body').then(($body) => {
    // synchronously query from body
    // to find which element was created
    if ($body.find('input[name=email]').length) {
      cy.get('#ldap_login').click({force: true});
      cy.wait(1000);
    }
  });
});
