import React from "react";
import ReactDOM from "react-dom/client";
import { Box } from "@mui/material";

import { InventoryExample } from "./InventoryExample";
import { TreeViewGrid } from "./TreeViewGrid";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Box sx={{ p: 2 }}>
      <TreeViewGrid />
      <InventoryExample />
    </Box>
  </React.StrictMode>,
);
