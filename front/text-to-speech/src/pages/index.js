import React, { useState, useEffect } from "react";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const [audioUrl, setAudioUrl] = useState("");

  useEffect(() => {
    console.log(text);
  }, [text]);

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
        const data = await response.json();
        // Faça algo com a resposta do servidor
        console.log(data);
        alert(data.message);
      } else {
        throw new Error("Erro ao converter o texto em áudio");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao converter o texto em áudio");
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
      {audioUrl && <audio src={`http://localhost:5000${audioUrl}`} controls />}
    </div>
  );
}
