import "./public-path";
import React from "react";
import ReactDOM from "react-dom";
import App from "@UI/App";
// import registerServiceWorker from "./registerServiceWorker";
import { unregister } from './registerServiceWorker';
import { hot } from "react-hot-loader";

import { MuiPickersUtilsProvider } from 'material-ui-pickers';
import DateFnsUtils from '@date-io/date-fns';
import arLocale from "date-fns/locale/es";

//REDUX
import { Provider } from "react-redux";
import Store, { history } from "@Redux/Store/index";

//Router
import { ConnectedRouter } from "connected-react-router";

let MiApp = () => (
  <Provider store={Store}>
    <ConnectedRouter history={history}>
      <MuiPickersUtilsProvider utils={DateFnsUtils} locale={arLocale}>
        <App />
      </MuiPickersUtilsProvider>
    </ConnectedRouter>
  </Provider>
);

hot(module)(MiApp);
ReactDOM.render(<MiApp />, document.getElementById("root"));

unregister();
// registerServiceWorker();
