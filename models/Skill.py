class Skill:
    def __init__(self, name, power, element=None):
        self.name = name
        self.power = power
        self.element = element

    def __repr__(self):
        return f"{self.name} (Power {self.power}, {self.element})"
