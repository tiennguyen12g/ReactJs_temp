import "./App.css";
import { I18nProvider } from "./i18n";
import { QueryProvider } from "./tanstack_query/QueryProvider";

import Test from "./Test";
import TestSeriUi from "./components/ui/Test";
import CryptoMain from "./components/CryptoMain";
import { Route, Routes } from "react-router-dom";
const AppContent = () => {


  return (
    <div>
      <div className="container mx-auto px-4 py-8">

        <Routes>
          <Route path="/" element={<CryptoMain />} />
          <Route path="/test" element={<Test />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <QueryProvider>
      <I18nProvider>
        <AppContent />
      </I18nProvider>
    </QueryProvider>
  );
}

export default App;
