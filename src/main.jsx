import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";
import Home from "./pages/CanvasBoard";
import CastDisplay from "./pages/CastDisplay";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/display",
    element: <CastDisplay />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <DndProvider backend={HTML5Backend}>
    <RouterProvider router={router} />
  </DndProvider>
);
