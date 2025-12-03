# Hero AI Fight 🎮⚔️

An AI-powered turn-based battle game where you create custom heroes by describing them in natural language. The system uses a local LLM (Gemma-3-1b-it) to generate heroes with unique abilities and balanced boss opponents.

## 🌟 Features

- **AI-Powered Character Generation**: Describe your hero in plain text and watch the AI create a unique character with element-based abilities
- **Elemental System**: Three elements (FIRE, WATER, AIR) with distinct damage profiles and visual themes
- **Dynamic Boss Creation**: AI generates balanced boss opponents that counter your hero's abilities
- **Turn-Based Combat**: Strategic battle system with attack and defend mechanics
- **Interactive Canvas**: Visual representation of battles with custom character sprites
- **Real-Time Stats**: Live tracking of HP, attack, defense, and active skills
- **Battle Log**: Detailed history of all combat actions

## 🎯 Element System

### FIRE 🔥
- **Damage Range**: 20-35 (High damage)
- **Stats**: High attack, low defense
- **Keywords**: fire, flame, heat, lava, magma, burn

### WATER 💧
- **Damage Range**: 12-22 (Balanced)
- **Stats**: Balanced attack and defense
- **Keywords**: water, ice, frost, tide, bubble, pressure

### AIR 🌪️
- **Damage Range**: 8-18 (Fast/Light)
- **Stats**: Low attack, moderate defense
- **Keywords**: wind, storm, gale, air blades, vacuum

## 🚀 Technologies

### Backend
- **Flask**: REST API server
- **Transformers (HuggingFace)**: LLM integration
- **PyTorch**: Deep learning framework
- **Gemma-3-1b-it**: Google's instruction-tuned language model
- **YAML**: Structured AI prompts

### Frontend
- **Vanilla JavaScript (ES6 Modules)**: Modern modular architecture
- **HTML5 Canvas**: Character rendering and animations
- **CSS3**: Responsive design with gradient effects

## 📋 Prerequisites

- Python 3.8+
- CUDA-compatible GPU (recommended for fast inference)
- HuggingFace account and API token

## 🛠️ Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd hero-ai-fight
```

2. **Install Python dependencies**
```bash
pip install -r requirements.txt
```

3. **Configure environment variables**

Create a `.env` file in the root directory:
```env
HF_TOKEN=your_huggingface_token_here
```

Get your HuggingFace token at: https://huggingface.co/settings/tokens

4. **Verify GPU setup (optional but recommended)**
```bash
python -c "import torch; print(torch.cuda.is_available())"
```

## 🎮 How to Play

1. **Start the server**
```bash
python main.py
```

The server will start at `http://127.0.0.1:5000`

2. **Open your browser**
Navigate to `http://127.0.0.1:5000`

3. **Create your hero**
Describe your hero in the text input, for example:
- "fire warrior with flame blade"
- "water mage with ice powers"
- "air ninja with wind techniques"

4. **Start the battle**
Click "Start Battle" and choose your actions:
- **Attack**: Select a skill to damage the boss
- **Defend**: Increase defense by 50% for one turn

5. **Win condition**
Reduce the boss's HP to 0 before yours runs out!

## 📁 Project Structure

```
hero-ai-fight/
├── ai_module/
│   ├── selector.py           # AI character generation logic
│   └── prompt/
│       ├── choose_skills.yaml    # Hero creation prompt
│       └── create_boss.yaml      # Boss generation prompt
├── models/
│   ├── Hero.py               # Hero class with stats
│   ├── Boss.py               # Boss class with stats
│   └── Skill.py              # Skill data structure
├── static/
│   ├── css/
│   │   └── style.css         # Game styling
│   ├── js/
│   │   ├── script.js         # Main entry point
│   │   ├── api.js            # Backend communication
│   │   ├── battle.js         # Combat logic
│   │   ├── canvas.js         # Rendering engine
│   │   ├── config.js         # Game constants
│   │   ├── state.js          # Global state management
│   │   ├── stats.js          # UI stats updates
│   │   └── utils.js          # Helper functions
│   └── images/               # Character sprites
├── templates/
│   └── index.html            # Main HTML page
├── main.py                   # Flask server
├── requirements.txt          # Python dependencies
└── .env                      # Environment variables
```

## 🔧 API Endpoints

### `POST /create-hero`
Creates a hero and boss based on user input.

**Request Body:**
```json
{
  "hero_input": "fire warrior with flame blade"
}
```

**Response:**
```json
{
  "hero": {
    "element": "FIRE",
    "hp": 100,
    "attack": 15,
    "defense": 12,
    "skills": [
      {"name": "Flame Blade", "power": 25, "element": "FIRE"}
    ]
  },
  "boss": {
    "element": "WATER",
    "hp": 120,
    "attack": 18,
    "defense": 22,
    "skills": [
      {"name": "Ice Counter", "power": 20, "element": "WATER", "counter_to": "Flame Blade"}
    ]
  }
}
```

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "online",
  "message": "Flask server running!"
}
```

## 🎨 Game Mechanics

### Combat System
- **Turn Order**: Randomly determined at battle start
- **Damage Calculation**: `(Attack + Skill Power) - Defense`
- **Defend Bonus**: 1.5x defense multiplier for one turn
- **Minimum Damage**: 1 (attacks always deal at least 1 damage)

### Character Stats
**Hero:**
- HP: 100
- Stats vary by element

**Boss:**
- HP: 120
- Stats designed to counter hero element

### AI Balancing
The AI ensures fair gameplay by:
- Generating boss skills with similar power levels (±3 points)
- Creating counter-abilities to hero skills
- Selecting different elements for type advantage

## 🐛 Troubleshooting

### GPU Not Detected
If CUDA is unavailable, the model will run on CPU (slower):
```python
# In selector.py, change:
device="cpu"  # instead of "cuda"
```

### Model Download Issues
First run downloads ~4GB model. Ensure stable internet connection.

### Port Already in Use
Change port in `main.py`:
```python
app.run(debug=True, host="0.0.0.0", port=5001)  # Change 5000 to 5001
```
