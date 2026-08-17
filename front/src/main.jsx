import { createRoot } from "react-dom/client"

import { App } from "./App"

import "./style/reset.sass"

import "./style/main.sass"

createRoot(document.getElementById("root")).render(<App />)
