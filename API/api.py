import azure.cognitiveservices.speech as speechsdk
from flask import Flask, request, jsonify, send_file
from playsound import playsound
from flask_cors import CORS
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials

app = Flask(__name__)
CORS(app)

speech_key = "7cf7dde62a234b11a42c323fac003037"
service_region = "eastus"

subscription_key = "c1f12209e9504dd6bdc762108f7db4b5"
endpoint = "https://computer-vision-ana.cognitiveservices.azure.com/"


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


@app.route("/image-to-text", methods=["POST"])
def image_to_text():
    image = request.files["image"]
    image_bytes = image.read()  # Lê os bytes da imagem

    computervision_client = ComputerVisionClient(
        endpoint, CognitiveServicesCredentials(subscription_key)
    )

    response = computervision_client.recognize_printed_text_in_stream(image_bytes)

    extracted_text = ""
    for region in response.regions:
        for line in region.lines:
            for word in line.words:
                extracted_text += word.text + " "
                return jsonify(extracted_text)


if __name__ == "__main__":
    app.run(debug=True)
