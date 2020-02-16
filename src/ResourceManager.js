import React from "react";
import { combineReducers } from "redux";
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
    this.actions = { ...this.actions, ...resource.actions };
  }

  makeReducer(actions) {
    const reducer = (state = {}, action) => {

      if (!actions[action.type]) {
        return state;
      }

      return actions[action.type].handler(state, action);
    }

    return reducer;
  }

  get reducer() {
    const reducers = {};
    const defaultState = {};

    Object.keys(this.resources).forEach(
      key => {
        reducers[key] = this.makeReducer(this.resources[key].actions);
        defaultState[key] = { items: {} }
      }
    );

    return [ combineReducers(reducers), defaultState ];
  }

  getResource(resourceName) {
    return this.resources[resourceName];
  }
}

export const RESTResourcesContext = React.createContext({});

export default ResourceManager;
