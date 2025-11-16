import random
from .skill import Skill

class Hero:
    def __init__(self, element, hp=100):
        self.element = element
        self.hp = hp
        self.skills = []

        self.attack, self.defense = self.generate_stats(element)

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

    def add_skill(self, skill: Skill):
        self.skills.append(skill)

    def show_info(self):
        print("\n=== HERO INFO ===")
        print(f"Element: {self.element}")
        print(f"HP: {self.hp}")
        print(f"ATK: {self.attack}")
        print(f"DEF: {self.defense}")
        print("\nSkills:")
        for s in self.skills:
            print(f" - {s.name} | Power: {s.power}")