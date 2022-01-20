describe('artemis-web', () => {

  const settings = {
    "imageConfig": {
      "createDiffImage": false,                // Should a "diff image" be created, can be disabled for performance
      "threshold": 0.01,                      // Amount in pixels or percentage before snapshot image is invalid
      "thresholdType": "percent",             // Can be either "pixel" or "percent"
    },
  };

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('remember_me', 'sid', 'access_token');
  });

  it('[LDAP] admin logs in', () => {
    cy.visit('/login');
    cy.get('h1').should('have.text', 'Sign In');
    cy.typeLogin({ email: 'hermes@planetexpress.com', password: 'hermes' });
    cy.wait(2000);
    cy.loginLDAP();
  });

  it('[VTEST] Dashboard', () => {
    cy.visit('/dashboard')
      .then(() => {
        cy.document()
          .toMatchImageSnapshot(settings);
      });
  });

  it('[VTEST] BGP Updates', () => {
    cy.visit('/bgpupdates')
      .then(() => {
        cy.document()
          .toMatchImageSnapshot(settings);
      });
  });

  it('[VTEST] hijacks', () => {
    cy.visit('/hijacks')
      .then(() => {
        cy.document()
          .toMatchImageSnapshot(settings);
      });
  });

  it('[VTEST] system', () => {
    cy.visit('/admin/system')
      .then(() => {
        cy.document()
          .toMatchImageSnapshot(settings);
      });
  });
});
