import Chance from 'chance';



describe('artemis-web', () => {
    it('[API] login', () => {
        cy.visit('/');
        cy.request({
            method: 'POST',
            url: '/api/auth/credentials',
            body: {}
        });
    });
});
