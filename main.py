from ai_module.selector import AISelector

def main():
    
    user_input = 'My character have magma punch, air flow, flamethrower, and warm-kick'
    ai_selector = AISelector(user_input)
    result = ai_selector.choose_hability()
    
    print(f'AI OUTPUT: {result}')

if __name__ == '__main__':
    main()