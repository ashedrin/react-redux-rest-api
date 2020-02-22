import ResourceTransport from "./ResourceTransport";

const createAction = (config) => {
  const defaultRequestHandler = (request) => ({ items: request });
  const requestHandler = config.requestHandler || defaultRequestHandler;
  const creator = (request) => ({ type: config.actionType, payload: requestHandler(request) });
  const handler = (state) => (state);

  return {
    creator,
    handler: config.handler || handler
  }
}

const defaultActionsConfig = {
  get: {
    actionType: 'get',
    requestHandler: (state, { payload: { item } }) => {
      return {
        ...state,
        items: { ...state.items, [item.id]: item }
      }
    }
  },
  create: {
    actionType: 'create',
    requestHandler: (state, { payload: { item }}) => {
      return {
        ...state,
        items: { ...state.items, [item.id]: item }
      }
    }
  },
  update: {
    actionType: 'update',
    requestHandler: (state, { payload: { item }}) => {
      return {
        ...state,
        items: { ...state.items, [item.id]: item }
      }
    }
  },
  remove: {
    actionType: 'remove',
    requestHandler: (request) => ({ item: { id: request.id } }),
    handler: (state, { payload: { item }}) => {
      const items = { ...state.items };
      delete items[item.id];

      return { ...state, items, count: state.count - 1 }
    }
  },
  list: {
    actionType: 'list',
    requestHandler: (request) => ({
      items: request.items.reduce((reducer, item) => ({ ...reducer, [item.id]: item }), {})
    }),
    handler: (state, { payload }) => {
      return {
        ...state,
        ...payload
      }
    }
  },
};

class Resource {
  constructor(config) {
    if (!config.name) {
      throw new Error('Resource config, should contains a name');
    }

    if (!config.apiURL) {
      throw new Error('Resource config, should contains a apiURL');
    }

    this.apiURL = config.apiURL;
    this.transport = config.transport || new ResourceTransport();
    this.name = config.name;
    this.singlePath = config.singlePath || config.name;
    this.pluralPath = config.pluralPath || this.singlePath + 's';
    const actions = {
      ...defaultActionsConfig,
      ...(config.actions || {})
    }

    this.actions = Object.keys(actions).reduce(
      (reducer, actionKey) => {
        reducer[actionKey] = createAction(actions[actionKey]);
        return reducer;
      },
      {}
    );
  }

  makeQueryParams(params) {
    if (params) {
      const pairs =  Object.keys(params).map(key => `${key}=${params[key]}`);

      return pairs.join('&');
    }

    return null;
  }

  appendParams(url, params) {
    const paramsString = this.makeQueryParams(params);

    if (paramsString) {
      return url + '?' + paramsString;
    }

    return url;
  }

  selectState(store) {
    return store[`api_${this.name}`];
  }

  selectItems(store) {
    return store[`api_${this.name}`].items;
  }

  selectItem(store, itemId) {
    return store[`api_${this.name}`].items[itemId];
  }

  get({ resourceId, queryParams, bodyParams, dispatch } = {}) {
    return new Promise(
      (ok, fail) => {
        const method = 'get';
        const endpoint = this.appendParams(`${this.apiURL}/${this.singlePath}/${resourceId}`, queryParams);

        this.transport
          .request({ method, endpoint, bodyParams })
          .then(
            ({ response, json }) => {
              dispatch(this.actions[`${this.name}_get`].creator(json));
              ok({ response, json });
            }
          )
          .catch(error => fail(error))
        ;
      }
    );
  }

  create({ queryParams, bodyParams, dispatch } = {}) {
    return new Promise(
      (ok, fail) => {
        const method = 'post';
        const endpoint = this.appendParams(`${this.apiURL}/${this.singlePath}`, queryParams);

        this.transport
          .request({ method, endpoint, bodyParams })
          .then(
            ({ response, json }) => {
              dispatch(this.actions[`${this.name}_create`].creator(json));
              ok({ response, json });
            }
          )
          .catch(error => fail(error))
        ;
      }
    )
  }

  update({ resourceId, queryParams, bodyParams, dispatch } = {}) {
    return new Promise(
      (ok, fail) => {
        const method = 'put';
        const endpoint = this.appendParams(`${this.apiURL}/${this.singlePath}/${resourceId}`, queryParams);

        this.transport
          .request({ method, endpoint, bodyParams })
          .then(
            ({ response, json }) => {
              dispatch(this.actions[`${this.name}_update`].creator(json));
              ok({ response, json });
            }
          )
          .catch(error => fail(error))
      }
    );
  }

  remove({ resourceId, queryParams, bodyParams, dispatch } = {}) {
    return new Promise(
      (ok, fail) => {
        const method = 'delete';
        const endpoint = this.appendParams(`${this.apiURL}/${this.singlePath}/${resourceId}`, queryParams);

        return this.transport
          .request({ method, endpoint, bodyParams })
          .then(
            (data) => {
              dispatch(this.actions[`${this.name}_remove`].creator(data.json));
              ok(data);
            }
          )
          .catch(error => fail(error))
      }
    );
  }

  list({ queryParams, bodyParams, dispatch } = {}) {
    return new Promise(
      (ok, fail) => {
        const method = 'get';
        const endpoint = this.appendParams(`${this.apiURL}/${this.singlePath}`, queryParams);

        this.transport
          .request({ method, endpoint, bodyParams })
          .then(({ json }) => {
            dispatch(this.actions.list.creator(json));
            ok(json);
          })
          .catch(error => fail(error));
        ;
      }
    );
  }

  bulkCreate(resourceId, { queryParams, bodyParams } = {}) {
    const method = 'post';
    const endpoint = this.appendParams(`${this.apiURL}/${this.pluralPath}`, queryParams);

    return this.transport.request({ method, endpoint, bodyParams });
  }

  bulkUpdate(resourceId, { queryParams, bodyParams } = {}) {
    const method = 'patch';
    const endpoint = this.appendParams(`${this.apiURL}/${this.pluralPath}`, queryParams);

    return this.transport.request({ method, endpoint, bodyParams });
  }

  bulkRemove(resourceId, { queryParams, bodyParams } = {}) {
    const method = 'delete';
    const endpoint = this.appendParams(`${this.apiURL}/${this.pluralPath}`, queryParams);

    return this.transport.request({ method, endpoint, bodyParams });
  }
}

export default Resource;
