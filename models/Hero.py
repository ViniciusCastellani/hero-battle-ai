import random
from .Skill import Skill

class Hero:
    def __init__(self, result, hp=100):
        self.result = result
        self.element = result["element"]
        self.hp = hp
        self.skills = []

        self.attack, self.defense = self.generate_stats(self.element)

    def generate_stats(self, element):
        if element == "FIRE":
            base_def = 12  
            base_atk = 15
        elif element == "WATER":
            base_def = 18
            base_atk = 10
        elif element == "AIR":
            base_def = 14
            base_atk = 8
        else:
            base_def = 10
            base_atk = 10

        hero_atk = int(base_atk)
        hero_def = int(base_def)
    
        return hero_atk, hero_def

    def add_skill(self):
        for skill_data in self.result["skills"]:
            name = skill_data["name"]
            power = skill_data["power"]

            new_skill = Skill(name=name, power=power, element=self.element)

            self.skills.append(new_skill)

    def show_info(self):
        print("\n=== HERO INFO ===")
        print(f"Element: {self.element}")
        print(f"HP: {self.hp}")
        print("\nSkills:")
        for s in self.skills:
            print(f" - {s.name} | Power: {s.power}")