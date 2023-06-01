import requests

url = 'http://localhost:5000/text-to-speech'
texto = 'Quem vai fazer é sua muié, Nicole Otaka'

payload = {'text': texto}
response = requests.post(url, json=payload)

if response.status_code == 200:
    # Se a requisição for bem-sucedida, você pode fazer algo com a resposta
    print('Conversão de texto para fala concluída!')
else:
    # Se a requisição não for bem-sucedida, você pode lidar com o erro
    print('Erro ao converter texto para fala:', response.text)
