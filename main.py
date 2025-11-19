from ai_module.selector import AISelector
from models.Hero import Hero
from models.Boss import Boss
from models.Skill import Skill
from models.Team import Team
import json

def main():
    userTeam = Team(name="User Team")
        
    """
        Hero module
            TODO - Implement flask's server to get the user input
    """

    hero_inputs = [
        "My hero has magma punch, hot waves, flame burst and burning charge.",
    ]

    for user_input in hero_inputs:
        ai = AISelector(user_input)
        result = ai.choose_hability()
        
        print("USER INPUT:", user_input)
        print('\n')
        
        hero = Hero(result)

        hero.add_skill()
    
        userTeam.add_hero(hero)
        hero.show_info()

    """
        Boss module
    """
    create_boss = ai.create_boss(hero)
    boss = Boss(create_boss)
    boss.add_skill()
    boss.show_info()

    print("\n" + "="*40)
    userTeam.show_team()

if __name__ == "__main__":
    main()