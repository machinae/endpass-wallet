describe('Log In To an Existing Account', () => {
  it('should show log in modal on home page', () => {
    cy.server();
    // Not logged in
    cy.route({
      method: 'GET',
      url: '/identity/api/v1.1/*',
      response: {},
      status: 401,
    });

    cy.route('POST', '/identity/api/v1.1/auth', 'fixture:identity/auth');

    cy.visit('#/');
    cy.mockWeb3Requests();
    cy.get('[data-test=login-modal] input[name=email]').type(
      'user@example.com{enter}',
    );
  });

  it('should not show login modal if already logged in', () => {
    cy.login();

    cy.visit('#/');
    cy.mockWeb3Requests();
    cy.get('[data-test=login-modal]').should('not.exist');
  });
});
