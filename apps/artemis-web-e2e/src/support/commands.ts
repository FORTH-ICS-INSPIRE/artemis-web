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
import 'cypress-plugin-snapshots/commands';

// -- This is a parent command --
Cypress.Commands.add('typeLogin', (user) => {
  cy.get('body').then(($body) => {
    // synchronously query from body
    // to find which element was created
    if ($body.find('input[name=email]').length) {
      cy.get('input[name=email]').type(user.email);

      cy.get('input[name=login_password]').type(user.password);

      // cy.get('input[name=captcha]').type('123');

      cy.get('input[type=checkbox]').click({ force: true });
    }
  });
});

Cypress.Commands.add('typeRegister', (user) => {
  cy.get('#username').type(user.name);
  cy.get('#email').type(user.email);
  cy.get('#captcha').type('123');
  cy.get('#password').type(user.password);
});

Cypress.Commands.add('typeChangePass', (user) => {
  cy.get('#old_password').type(user.old_pass);
  cy.get('#new_password').type(user.new_pass);
  cy.get('#repeat_password').type(user.new_pass);

  cy.get('#submit').click({ force: true });
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
      cy.get('button[type=submit]').click({ force: true });
      cy.wait(1000);
    }
  });
});

Cypress.Commands.add('loginLDAP', () => {
  cy.get('body').then(($body) => {
    // synchronously query from body
    // to find which element was created
    if ($body.find('input[name=email]').length) {
      cy.get('#ldap_login').click({ force: true });
      cy.wait(1000);
    }
  });
});
