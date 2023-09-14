import "./App.css";
import VotePage from "./components/vote-page";
import AdminPage from "./components/admin";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VotePage />} />
        <Route path="/match/:id" element={<VotePage />}/>
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
