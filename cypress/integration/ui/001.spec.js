/// <reference types="cypress" />

describe('chefcookie test 001', () => {
  beforeEach(() => {
    cy.visit('/_tests/001.html')
  })

  it('displays popup', () => {
    cy.get('.chefcookie__box').should('exist')
    cy.contains('We use cookies')
  })

  it('accepts cookies', () => {
    cy.get('.chefcookie__button.chefcookie__button--accept').click()
    cy.reload()
    cy.get('.chefcookie__box').should('not.exist')
  })

})
