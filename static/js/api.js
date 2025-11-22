import { API_URL } from './config.js';
import { elements, setHero, setBoss } from './state.js';
import { render } from './canvas.js';
import { showLoading } from './utils.js';


export async function createHero() {
    if (!elements.heroInput) return;

    const input = elements.heroInput.value.trim();

    if (!input) {
        alert('Please describe your hero!');
        return;
    }

    showLoading(true);

    try {
        const response = await fetch(`${API_URL}/create-hero`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ hero_input: input })
        });

        const data = await response.json();

        if (response.ok) {
            setHero(data.hero);
            setBoss(data.boss);

            elements.heroInput.value = '';

            console.log('Hero created:', data.hero);
            console.log('Boss created:', data.boss);

            render();
        } else {
            alert('Error while creating hero: ' + (data.erro || data.error));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error while trying to connect to the server.');
    } finally {
        showLoading(false);
    }
}