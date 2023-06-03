from pydub import AudioSegment

input_file = "./output.wav"
output_file = "../output.mp3"


def convert_wav_to_mp3(input_file, output_file):
    audio = AudioSegment.from_wav(input_file)
    audio.export(output_file, format="mp3")


with open(input_file, "rb") as f:
    data = f.read()
    print(data)
    convert_wav_to_mp3(data, output_file)
