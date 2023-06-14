import TextToSpeech from "./pages";
import "./App.css";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastProvider } from "react-toast-notifications";

function App() {
  return (
    <ToastProvider>
      <TextToSpeech />
    </ToastProvider>
  );
}

export default App;
