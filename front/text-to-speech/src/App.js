import TextToSpeech from "./pages";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TextToSpeech />} />
      </Routes>
    </Router>
  );
}

export default App;
