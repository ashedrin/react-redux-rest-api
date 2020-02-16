import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import ResourceManager, { RESTResourcesContext } from "./ResourceManager";
import App from "./App";

const manager = new ResourceManager({ url: 'localhost:3000' });
manager.createResource({ name: 'post' });

const [reducer, defaultState] = manager.reducer;

const store = createStore(reducer, defaultState, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

ReactDOM.render(
  <Provider store={store}>
    <RESTResourcesContext.Provider value={{ manager }}>
      <App />
    </RESTResourcesContext.Provider>
  </Provider>,
  document.getElementById('app')
);
