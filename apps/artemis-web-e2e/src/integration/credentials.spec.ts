import Chance from 'chance';

let newEmail;
let newPass;
let newName;

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
    newName = name;
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

  it('[LDAP] admin logs in', () => {
    cy.visit('/login');
    cy.get('h1').should('have.text', 'Sign In');
    cy.typeLogin({ email: 'hermes@planetexpress.com', password: 'hermes' });
    cy.loginLDAP();
    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'Dashboard');
  });

  it('[LDAP] admin visits User Management Page', () => {
    cy.get('body').type('{alt+m}');

    cy.waitFor('h1');
    cy.get('h1').should('have.text', 'User Management');

    cy.get('#distinct_values_selection').find(`option:contains('${newName}')`).then($el =>
      $el.get(0).setAttribute("selected", "selected")
    ).parent().trigger("change")
    cy.get('#approval').click({ force: true });
    cy.wait(1000);
    cy.get('#logout', { timeout: 2000 }).click({ force: true });
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Sign In');
  });

  it('logs in', () => {
    cy.visit('/login');
    cy.get('h1').should('have.text', 'Sign In');
    cy.typeLogin({ email: newEmail, password: newPass });
    cy.login();
    cy.wait(2000);
    cy.get('h1').should('have.text', 'Dashboard');
  });

  it('change password', () => {
    cy.get('body').type('{alt+p}');

    cy.get('h1').should('have.text', 'Change Password');
    cy.typeChangePass({ old_pass: newPass, new_pass: "1234" });
    cy.contains('updated');
  });
});
