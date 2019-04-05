import ReactDOM from "react-dom";
import "./styles.css";

import React from "react";

//components
import { App } from "./components/app";

var mountNode = document.getElementById("app");
ReactDOM.render(<App />, mountNode);
