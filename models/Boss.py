import random
from .Skill import Skill

class Boss:
    def __init__(self, result, hp=100):
        self.boss_result = result
        self.boss_element = result["element"]
        self.hp = hp
        self.skills = []

    def add_skill(self):
        for skill_data in self.boss_result["skills"]:
            name = skill_data["name"]
            power = skill_data["power"]

            new_skill = Skill(name=name, power=power, element=self.boss_element)

            self.skills.append(new_skill)

    def show_info(self):
        print("\n=== BOSS INFO ===")
        print(f"Element: {self.boss_element}")
        print(f"HP: {self.hp}")
        print("\nSkills:")
        for s in self.skills:
            print(f" - {s.name} | Power: {s.power}")