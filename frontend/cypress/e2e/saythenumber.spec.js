// frontend/cypress/e2e/saythenumber.cy.js
describe('Say The Number Application', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('should display the application title', () => {
    cy.contains('Say the Number').should('be.visible')
  })

  it('should show the introductory message', () => {
    cy.contains('Hi, I can say numbers for you.').should('be.visible')
  })

  it('should have a number input field', () => {
    cy.get('input[type="tel"]')
      .should('be.visible')
      .should('have.attr', 'placeholder', 'Enter a number (e.g., -3.14 or 208)')
  })

  it('should filter non-numeric input', () => {
  cy.get('input[type="tel"]').type('abc123.45-')
  cy.get('input[type="tel"]').should('have.value', '-123.45')
})

  describe('"Say it now" button', () => {
    it('should be visible and enabled initially', () => {
      cy.contains('button', 'Say it now')
        .should('be.visible')
        .should('not.be.disabled')
    })

    it('should show error when empty input', () => {
      cy.contains('button', 'Say it now').click()
      cy.contains('Please enter a number').should('be.visible')
    })

    it('should convert positive integer correctly', () => {
      cy.get('input[type="tel"]').type('123')
      cy.contains('button', 'Say it now').click()
      cy.contains('one hundred twenty three').should('be.visible')
    })

    it('should convert negative number correctly', () => {
      cy.get('input[type="tel"]').type('-123')
      cy.contains('button', 'Say it now').click()
      cy.contains('negative one hundred twenty three').should('be.visible')
    })

    it('should convert decimal number correctly', () => {
      cy.get('input[type="tel"]').type('3.14')
      cy.contains('button', 'Say it now').click()
      cy.contains('three point one four').should('be.visible')
    })
  })

  describe('"Say it with a delay" button', () => {
    it('should be visible and enabled initially', () => {
      cy.contains('button', 'Say it with a delay')
        .should('be.visible')
        .should('not.be.disabled')
    })

    it('should show loading state during delay', () => {
      cy.get('input[type="tel"]').type('42')
      cy.contains('button', 'Say it with a delay').click()

      // Check loading state
      cy.get('[data-test="button-delay"]')
        .find('svg.animate-spin')
        .should('be.visible')

      // Other button should be disabled during loading
      cy.get('[data-test="button-now"]').should('be.disabled')

      // Eventually show result
      cy.contains('forty two', { timeout: 6000 }).should('be.visible')
    })
  })

  describe('Error handling', () => {
    it('should show rate limit error when requests are too frequent', () => {
      // We'll mock the API response since we can't reliably trigger rate limiting in tests
      cy.intercept('GET', '/api/num_to_english*', {
        statusCode: 429,
        body: {
          status: 'error',
          message: 'Rate limit exceeded. Try again later.'
        }
      }).as('rateLimited')

      cy.get('input[type="tel"]').type('123')
      cy.get('[data-test="button-now"]').click()

      cy.wait('@rateLimited')
      cy.contains('Rate limit exceeded.').should('be.visible')
    })

    it('should show error message if number is too long', () => {
      cy.get('input[type="tel"]').type('123456789123456789123456789')
      cy.get('[data-test="button-now"]').click()
      cy.contains('Number too large').should('be.visible')
    })
  })

  describe('Theme toggle', () => {
    it('should have a theme toggle button', () => {
      cy.get('[aria-label="Toggle dark mode"]').should('be.visible')
    })

    it('should switch between light and dark mode', () => {
      // Initial state - light mode
      cy.get('html').should('not.have.attr', 'data-theme', 'dark')

      // Click to toggle to dark mode
      cy.get('[aria-label="Toggle dark mode"]').click()
      cy.get('html').should('have.attr', 'data-theme', 'dark')

      // Click again to toggle back to light mode
      cy.get('[aria-label="Toggle dark mode"]').click()
      cy.get('html').should('not.have.attr', 'data-theme', 'dark')
    })

    it('should persist theme preference', () => {
      // Set to dark mode
      cy.get('[aria-label="Toggle dark mode"]').click()

      // Reload page and verify theme persists
      cy.reload()
      cy.get('html').should('have.attr', 'data-theme', 'dark')
    })
  })
})
