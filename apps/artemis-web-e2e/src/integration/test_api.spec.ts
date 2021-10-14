import Chance from 'chance';

let newEmail;
let newPass;


describe('artemis-web-api', () => {
    it('[API] signup', () => {
        cy.visit('/');
        const chance = new Chance();
        newEmail = chance.email();
        newPass = chance.string({ length: 5 });
        const name = chance.first();

        cy.request({
            method: 'POST',
            url: '/api/auth/signup',
            headers: {
                'x-artemis-api-key': Cypress.env('API_KEY')
            },
            body: {
                "email": newEmail,
                "password": newPass,
                "name": name,
                "page": 'signup',
                "encryptedExpr": ''
            }
        }).then((response) => {
            expect(response.status, '200');
        });
    });


    it('[API] credentials login', () => {
        cy.visit('/');
        cy.request({
            method: 'POST',
            url: '/api/auth/login/credentials',
            headers: {
                'x-artemis-api-key': Cypress.env('API_KEY')
            },
            body: {
                "email": newEmail,
                "password": newPass,
                "rememberMe": false,
                "page": 'login',
                "_csrf": "",
                "encryptedExpr": ''
            }
        }).then((response) => {
            expect(response.body).to.have.property('user');

        });
    });

    it('[API] LDAP login', () => {
        cy.visit('/');
        cy.request({
            method: 'POST',
            url: '/api/auth/login/ldap',
            headers: {
                'x-artemis-api-key': Cypress.env('API_KEY')
            },
            body: {
                "email": "hermes@planetexpress.com",
                "password": "hermes",
                "page": 'login',
                "rememberMe": false,
                "_csrf": "",
                "encryptedExpr": ''
            }
        }).then((response) => {
            expect(response.body).to.have.property('user');

        });
    });

    it('[API] login rate limit', () => {
        cy.visit('/');
        cy.request({
            method: 'POST',
            url: '/api/auth/login/credentials',
            failOnStatusCode: false,
            headers: {
                'x-artemis-api-key': Cypress.env('API_KEY')
            },
            body: {
                "email": "hermes@planetexpress.com",
                "password": "hermes",
                "rememberMe": false,
                "page": 'login',
                "_csrf": "",
                "encryptedExpr": ''
            }
        }).then((response) => {
            expect(response.status, '429');
        });
    });
});
