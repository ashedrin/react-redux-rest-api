import React from "react";
import ResourceTransport from "./ResourceTransport";
import Resource from "./Resource";


class ResourceManager {
  constructor(config) {
    this.url = config.url
    this.schema = config.schema || 'http';
    this.prefix = config.prefix || '';
    this.transport = config.transport || new ResourceTransport();

    this.resources = {};
  }

  get apiURL() {
    return this.schema + '://' + this.url + this.prefix;
  }

  createResource(config) {
    const resource = new Resource({
      ...config,
      apiURL: this.apiURL,
      transport: this.transport
    });

    this.resources[config.name] = resource;
  }

  makeReducer(actions) {
    const reducer = (state = { items: {}}, action) => {
      if (!actions[action.type]) {
        return state;
      }

      return actions[action.type].handler(state, action);
    }

    return reducer;
  }

  get reducer() {
    const reducers = {};

    Object.keys(this.resources).forEach(
      key => {
        reducers['api_' + key] = this.makeReducer(this.resources[key].actions);
      }
    );

    return reducers;
  }

  getResource(resourceName) {
    return this.resources[resourceName];
  }
}

export const RESTResourcesContext = React.createContext({});

export default ResourceManager;
