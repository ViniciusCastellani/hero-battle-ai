from .Skill import Skill


class Boss:
    def __init__(self, result, hp=120):
        self.boss_result = result
        self.boss_element = result["element"]
        self.hp = hp
        self.skills = []
        self.attack, self.defense = self.generate_stats(self.boss_element)

    def generate_stats(self, element):
        if element == "FIRE":
            base_def = 14
            base_atk = 26

        elif element == "WATER":
            base_def = 22
            base_atk = 18

        elif element == "AIR":
            base_def = 12
            base_atk = 22

        else:
            base_def = 15
            base_atk = 18

        boss_atk = int(base_atk)
        boss_def = int(base_def)

        return boss_atk, boss_def

    
    def add_skill(self):
        for skill_data in self.boss_result["skills"]:
            name = skill_data["name"]
            power = skill_data["power"]
            new_skill = Skill(name=name, power=power, element=self.boss_element)
            self.skills.append(new_skill)

    def get_info_dict(self):
        return {
            "element": self.boss_element,
            "hp": self.hp,
            "attack": self.attack,
            "defense": self.defense,
            "skills": [
                {"name": skill.name, "power": skill.power, "element": skill.element}
                for skill in self.skills
            ],
        }
