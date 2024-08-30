import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import axios from "axios";
import { store, persistor } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root")).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>
      <App />
    </Provider>
  </PersistGate>
);
