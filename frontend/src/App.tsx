import { useRoutes } from "react-router-dom";
import { appRoutes } from "./router";

const App = () => {
  const element = useRoutes(appRoutes);
  return element;
};

export default App;
