/// <reference types="cypress" />

Cypress.on('uncaught:exception', (err, runnable) => {
    // returning false here prevents Cypress from
    // failing the test
    return false;
});

describe('chefcookie test 001', () => {
    beforeEach(() => {
        cy.visit('/_tests/index.html');
    });

    it('displays popup', () => {
        cy.get('.chefcookie__box').should('exist');
        cy.contains('We use cookies');
    });

    it('accepts cookies', () => {
        cy.get('.chefcookie__button.chefcookie__button--accept').click();
        cy.reload();
        cy.get('.chefcookie__box').should('not.exist');
    });
});
