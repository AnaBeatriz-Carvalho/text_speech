import TextToSpeech from "./pages";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<TextToSpeech />} />
    <ToastProvider>
      <TextToSpeech />
    </ToastProvider>
    //   </Routes>
    // </Router>
  );
}

export default App;
