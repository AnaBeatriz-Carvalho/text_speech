import React, { useState } from "react";
import { ToastProvider, useToasts } from "react-toast-notifications";
import "./styles.css";
export default function TextToSpeech() {
  const [text, setText] = useState("");
  const { addToast } = useToasts();
  const [image, setImage] = useState(null);
  const [convertedText, setConvertedText] = useState("");

  const handleTextChange = (event) => {
    setText(event.target.value);
  };
  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
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
  const convertToImage = async () => {
    try {
      const formData = new FormData();

      formData.append("image", image);
      let contentType = "";
      if (image.type === "image/jpeg") {
        contentType = "image/jpeg";
      } else if (image.type === "image/png") {
        contentType = "image/png";
      }
      const response = await fetch("http://localhost:5000/image-to-text", {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const convertedText = data.converted_text;
        setConvertedText(convertedText);
        addToast("Imagem convertida em texto com sucesso", {
          appearance: "success",
        });
      } else {
        addToast("Erro ao converter a imagem em texto", {
          appearance: "error",
        });
      }
    } catch (error) {
      // console.error(error);
      addToast("Algum erro ocorreu", { appearance: "error" });
    }
  };

  return (
    <>
      <div>
        <h1>Texto para Áudio</h1>
        <textarea
          value={text}
          onChange={handleTextChange}
          placeholder="Digite o texto que deseja converter em áudio"
        />
      </div>
      <div>
        <button onClick={convertToSpeech}>Converter para Áudio</button>
      </div>

      <div>
        <h1>Imagem para Texto</h1>
        <input type="file" onChange={handleImageChange} />
        <div>
          <button onClick={convertToImage}>Converter para Texto</button>
        </div>

        {convertedText && (
          <div>
            <h2>Texto Convertido:</h2>
            <p>{convertedText}</p>
          </div>
        )}
      </div>
    </>
  );
}
