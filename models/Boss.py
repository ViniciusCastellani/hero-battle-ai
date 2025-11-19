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
    
    def get_info_dict(self):
        return {
            'element': self.boss_element,
            'hp': self.hp,
            'skills': [
                {
                    'name': skill.name,
                    'power': skill.power,
                    'element': skill.element
                }
                for skill in self.skills
            ]
        }