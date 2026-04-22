import React from "react";
import { logger } from "./utils/logger.js";

function App() {
  React.useEffect(() => {
    logger.info("App component mounted");
    logger.error("Test remote log from Frontend!");
  }, []);

  return (
    <>
      <h1 className="text-3xl font-semibold text-blue-500">
        Rayan 10pshine Notes taking App
      </h1>
    </>
  );
}

export default App;
