from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from ai_module.selector import AISelector
from models.Hero import Hero
from models.Boss import Boss
import json

app = Flask(__name__)
CORS(app)

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
    
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "online", "message": "Servidor Flask rodando!"}), 200

if __name__ == "__main__":
    print("HERO BATTLE SYSTEM - SERVIDOR FLASK")
    print("Servidor rodando em: http://127.0.0.1:5000")
    print("Endpoints disponiveis:")
    print("   - POST /create-hero: Criar heroi")
    print("   - POST /create-boss: Criar boss")
    print("   - GET  /health     : Status do servidor")
    app.run(debug=True, host="0.0.0.0", port=5000)