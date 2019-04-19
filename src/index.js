import ReactDOM from "react-dom";
import "./styles.css";

import React from "react";

//components
import { App } from "./components/app";
import { ErrorBoundary } from "./components/errorBoundary";

var mountNode = document.getElementById("app");
ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, mountNode);
