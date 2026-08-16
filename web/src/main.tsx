import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { AuthGateway } from "./AuthGateway";
import { initializeTaskboardStorage } from "./storage";
import "./styles.css";

async function main() {
  await initializeTaskboardStorage();
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <AuthGateway>
        <App />
      </AuthGateway>
    </StrictMode>,
  );
}

void main();
