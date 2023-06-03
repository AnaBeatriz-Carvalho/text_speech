import azure.cognitiveservices.speech as speechsdk
from flask import Flask, request, jsonify, send_file
from playsound import playsound
from flask_cors import CORS
from pydub import AudioSegment
import ffmpeg

app = Flask(__name__)
CORS(app)

speech_key = "7cf7dde62a234b11a42c323fac003037"
service_region = "eastus"


@app.route("/text-to-speech", methods=["POST"])
def text_to_speech():
    text = request.json["text"]

    speech_config = speechsdk.SpeechConfig(
        subscription=speech_key, region=service_region
    )
    speech_config.speech_synthesis_voice_name = "pt-BR-ElzaNeural"
    speech_synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config)

    resultado = speech_synthesizer.speak_text_async(text).get()
    stream = speechsdk.AudioDataStream(resultado)

    audio_file = "./output.wav"
    stream.save_to_wav_file(audio_file)

    return send_file(audio_file, mimetype="audio/wav", as_attachment=True)


if __name__ == "__main__":
    app.debug = True
    app.run()
