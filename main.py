from flask import Flask, request, jsonify
from ai_module.selector import AISelector
from models.Hero import Hero
from models.Boss import Boss
import json

"""
    Steps to make the POST with postman/thunderclient:

        1. run main.py

        2. Set the URL:
            http://127.0.0.1:5000/create-hero

        3. Create the JSON input in the following format:

                {
                    "hero_input": "hero description"
                }
"""

app = Flask(__name__)

@app.route('/create-hero', methods=['POST'])
def create_hero():
    try:
        dados = request.get_json()
        hero_input = dados.get('hero_input', '')
        
        if not hero_input:
            return jsonify({'erro': 'hero_input error'}), 400

        ai = AISelector(hero_input)
        result = ai.choose_hability()
        
        hero = Hero(result)
        hero.add_skill()
 
        create_boss = ai.create_boss(hero)
        boss = Boss(create_boss)
        boss.add_skill()

        answer = {
            'hero': hero.get_info_dict(),
            'boss': boss.get_info_dict(),
            'user_input': hero_input
        }
        
        return jsonify(answer), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return jsonify({
        'status': '200',
        'endpoints': {
            '/create-hero': 'POST - Create the user HERO'
        }
    })

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=5000)