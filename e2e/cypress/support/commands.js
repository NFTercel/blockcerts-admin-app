const casServerUrl = "https://casserver.herokuapp.com/cas/login";

Cypress.Commands.add("login", () => {
  const firstRequest = {
    method: "GET",
    url: casServerUrl
  };

  const secondRequest = {
    method: "POST",
    url: casServerUrl,
    qs: {
      service:
        "http://admin.127.0.0.1.xip.io/accounts/login?next=%2Fmanage_credentials%2F"
    },
    followRedirect: true,
    form: true,
    body: {
      username: "casuser",
      password: "Mellon",
      _eventId: "submit"
    }
  };

  cy.request(firstRequest)
    .then(response => {
      expect(response.status).to.eq(200);

      const parser = new DOMParser();
      const html = parser.parseFromString(response.body, "text/html");
      const inputElements = html.querySelectorAll("input[name='execution']");

      if (inputElements && inputElements[0] && inputElements[0]["value"]) {
        secondRequest.body.execution = inputElements[0]["value"];
      }
    })
    .then(() => cy.request(secondRequest))
});
