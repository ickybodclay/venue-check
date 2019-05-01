import ReactDOM from "react-dom";

// style
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import "./styles.css";

import React from "react";

//components
import { App } from "./components/app";
import { ErrorBoundary } from "./components/errorBoundary";

var mountNode = document.getElementById("app");
ReactDOM.render(<ErrorBoundary><App /></ErrorBoundary>, mountNode);
