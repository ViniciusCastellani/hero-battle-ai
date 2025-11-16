from ai_module.selector import AISelector
from models.hero import Hero
from models.skill import Skill
from models.team import Team

def main():
    userTeam = Team(name="User Team")
    
    # List of user inputs for different heroes
    hero_inputs = [
        "My hero has magma punch, air flow, flame burst and burning charge.",
        "My hero has water splash, tsunami wave, and aqua shield.",
        "My hero has wind blade, tornado spin, and air barrier."
    ]
    
    for user_input in hero_inputs:
        ai = AISelector(user_input)
        result = ai.choose_hability()
        
        print("\nUSER INPUT:", user_input)
        print("AI RESULT:", result)
        
        hero = Hero(element=result["element"])
        for skill_data in result["skills"]:
            name = skill_data["name"]
            power = skill_data["power"]
            hero.add_skill(Skill(name=name, power=power, element=hero.element))
    
        userTeam.add_hero(hero)
        hero.show_info()
    
    print("\n" + "="*40)
    userTeam.show_team()

if __name__ == "__main__":
    main()