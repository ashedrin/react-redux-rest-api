class ResourceTransport {
  request (params) {
    return new Promise(
      (ok, fail) => {
        fetch(
          params.endpoint,
          {
            headers: { 'Content-Type': 'application/json'},
            method: params.method,
            body: JSON.stringify(params.bodyParams)
          }
        ).then(
          response => {
            response.json()
              .then(json => ok({ response, json }))
              .catch(error => fail(error));
          }
        ).catch(error => fail(error));
      }
    );
  }
}

export default ResourceTransport;
