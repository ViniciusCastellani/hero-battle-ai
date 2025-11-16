from .hero import Hero

class Team:
    def __init__(self, name):
        self.name = name
        self.members = []

    def add_hero(self, hero: Hero):
        self.members.append(hero)

    def show_team(self):
        print(f"\n=== TEAM: {self.name} ===")
        for i, hero in enumerate(self.members, start=1):
            print(f" - Hero {i} ({hero.element})")
            print(f"   HP: {hero.hp} | ATK: {hero.attack} | DEF: {hero.defense}")
            print(f"   Skills:")
            for skill in hero.skills:
                print(f"     - {skill.name} (Power: {skill.power})")