import { BrowserRouter } from "react-router-dom";
import { AppCore } from "./AppCore";
import { AppNavLink } from "@shared/ui/components/AppNavLink/AppNavLink";
import { AppRoutes } from "./_routes/routes";

function App() {
  return (
    <BrowserRouter>
      <div className="">
        <AppNavLink to={AppRoutes.admin.main}>ADMIN</AppNavLink>
        <AppNavLink to={AppRoutes.client.main}>CLIENT</AppNavLink>
        <AppCore />
      </div>
    </BrowserRouter>
  );
}

export default App;
