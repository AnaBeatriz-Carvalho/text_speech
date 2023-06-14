import React, { useState, useEffect } from "react";
import { ToastProvider, useToasts } from "react-toast-notifications";
import "./styles.css";
import axios from "axios";
import { AiFillPlayCircle } from "react-icons/ai";

export default function TextToSpeech() {
  const [text, setText] = useState("");
  const { addToast } = useToasts();
  const [convertedText, setConvertedText] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagenm, setimagenm] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const handleImagemChange = (event) => {
    setImagem(event.target.files[0]);
    setImageUrl(URL.createObjectURL(event.target.files[0]));
    console.log(imagem);
  };
  useEffect(() => {
    if (isSpeaking && speechText) {
      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.lang = "pt-BR";

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      speechSynthesis.speak(utterance);
    }
  }, [isSpeaking, speechText]);

  useEffect(() => {
    const imagename = imagem;
    console.log(imagem);
    if (imagename && imagename.name != null) {
      setimagenm(imagename.name);
      console.log(imagenm);
    } else {
      setimagenm("");
    }
  }, [imagem]);
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
  const extrairTextoDaImagem = async () => {
    const formData = new FormData();
    formData.append("imagem", imagem);

    let config = {
      method: "POST",
      maxBodyLength: Infinity,
      url: "LINK DISPONIBILIZADO NO AZURE",
      headers: {
        "Content-Type": "multipart/form-data",
        "Ocp-Apim-Subscription-Key": "950d713325ef4443a39a7916d233b911",
        "Ocp-Apim-Subscription-Region": "REGIÃO DISPONIBILIZADA NO AZURE",
      },
      data: formData,
    };

    axios
      .request(config)
      .then((response) => {
        const toparse = JSON.stringify(response);
        const parsedJSON = JSON.parse(toparse);
        const text = parsedJSON.data.regions.flatMap((region) =>
          region.lines.flatMap((line) => line.words.map((word) => word.text))
        );
        const convertedText = text.join(" ");
        setConvertedText(convertedText);
        setSpeechText(convertedText);
        console.log(convertedText);
        console.log(toparse);
        addToast("Texto extraído com sucesso", { appearance: "success" });
      })
      .catch((error) => {
        addToast("Erro ao extrair texto da imagem", { appearance: "error" });
      });
  };

  const reproduzirTexto = () => {
    const utterance = new SpeechSynthesisUtterance(convertedText);
    utterance.lang = "pt-BR";
    speechSynthesis.speak(utterance);
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
        <h1>Extraindo Texto de uma Imagem</h1>
        <div className="Container-Image">
          <label>
            <div className="input-label">
              <h1 className="h1-label">Clique aqui para escolher a imagem</h1>
            </div>
            <input type="file" onChange={handleImagemChange} />
          </label>
          <h1 className="Imagem-carregada">Imagem Carregada: {imagenm}</h1>
          <button onClick={extrairTextoDaImagem}>Enviar</button>
          <div>
            <h1>Texto Extraído:</h1>
            <h1 className="Imagem-carregada">{convertedText}</h1>
            {convertedText && (
              <div>
                <button onClick={reproduzirTexto}>
                  <AiFillPlayCircle size={20} /> Reproduzir Texto
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
