from .hero import Hero

class Team:
    def __init__(self, name):
        self.name = name
        self.members = []

    def add_hero(self, hero: Hero):
        self.members.append(hero)

    def show_team(self):
        print(f"\n=== TEAM: {self.name} ===")
        for hero in self.members:
            print(f" - {hero.name} ({hero.element})")
