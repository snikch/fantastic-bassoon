import { ConnectedRouter, connectRouter, routerMiddleware } from 'connected-react-router';
import * as React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch } from 'react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import persistState from 'redux-localstorage';
import './App.css';
import Nav from './components/nav';
import Registry from './components/registry';
import Checkout from './components/registry/checkout';
import history from './history';
import { rootReducer } from './redux/root-reducer';
// Add the redux dev tools to the window global for typescript.
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  connectRouter(history)(rootReducer), // new root reducer with router state
  composeEnhancers(
    persistState(),
    applyMiddleware(
      routerMiddleware(history) // for dispatching history actions
      // ... other middlewares ...
    )
  )
);

class App extends React.Component {
  public render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <React.Fragment>
            <Nav />
            <Switch>
              <Route exact={true} path="/" component={Registry} />
              <Route exact={true} path="/continue" component={Checkout} />
            </Switch>
          </React.Fragment>
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
