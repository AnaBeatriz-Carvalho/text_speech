import React, { useState } from "react";
import { ToastProvider, useToasts } from "react-toast-notifications";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const { addToast } = useToasts();

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const convertToSpeech = async () => {
    try {
      const response = await fetch("http://localhost:5000/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play();
        addToast("Áudio gerado com sucesso", { appearance: "success" });
      } else {
        addToast("Erro ao converter o texto em áudio", { appearance: "error" });
      }
    } catch (error) {
      console.error(error);
      addToast("Erro ao converter o texto em áudio", { appearance: "error" });
    }
  };

  return (
    <div>
      <h1>Text to Speech</h1>
      <textarea
        value={text}
        onChange={handleTextChange}
        placeholder="Digite o texto que deseja converter em áudio"
      />
      <button onClick={convertToSpeech}>Converter para Áudio</button>
    </div>
  );
}
