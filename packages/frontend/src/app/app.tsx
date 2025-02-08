import "./globals.css";
import Providers from "@/app/providers.tsx";
import Router from "@/app/router.tsx";

function App() {
  return (
    <Providers>
      <Router />
    </Providers>
  );
}

export default App;
