from ai_module.selector import AISelector
from models.hero import Hero
from models.skill import Skill

def main():
    user_input = "My hero has magma punch, air flow, flame burst and burning charge."

    ai = AISelector(user_input)
    result = ai.choose_hability()
    print("\nUSER INPUT:", user_input)
    print("\nAI RESULT:", result)

    hero = Hero(element=result["element"])

    for skill_data in result["skills"]:
        name = skill_data["name"]
        power = skill_data["power"]
        hero.add_skill(Skill(name=name, power=power, element=hero.element))

    hero.show_info()

if __name__ == "__main__":
    main()