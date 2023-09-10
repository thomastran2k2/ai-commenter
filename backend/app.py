import openai
from flask import Flask, jsonify, request

openai.api_key = ''#'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'
def chat(in_user, role='user'):
    pre_text = ''# can write whatever we want gpt to generate example: 'generate the for the folllwoing code \n'
    messages_history = [{'role':role, 'content':pre_text + in_user}]
    completion = openai.ChatCompletion.create(
    model = 'gpt-3.5-turbo',
    messages = messages_history
    )
    reply = completion.choices[0].message.content
    return reply

app = Flask(__name__)

@app.route('/', methods=['POST'])
def home():
    ans = chat(request.code)
    return ans #message.mess = module(message.mess), 
    #return jsonify(message.__str__())

if __name__ == '__main__':
    app.run(debug=True)