from transformers import pipeline
from huggingface_hub import login
from dotenv import load_dotenv
import yaml
import torch
import os    

class AISelector():
    def __init__(self, user_input):
        load_dotenv()  # <- carrega variáveis do .env
        self.user_input = user_input
        self.hf_token = os.getenv("HF_TOKEN")  # <- pega o token

        self.pipeline = pipeline(
            "text-generation",
            model="google/gemma-3-1b-it",
            device="cuda",
            dtype=torch.bfloat16
        )

        self.yaml_path = 'ai_module/prompt/choose_skills.yaml'

    def choose_hability(self):
        login(self.hf_token)

        with open(self.yaml_path, "r", encoding="utf-8") as f:
            prompt_data = yaml.safe_load(f)

        system_prompt = prompt_data["system"]["content"]
        user_prompt_template = prompt_data["user"]["content"]

        user_prompt = user_prompt_template.format(user_input=self.user_input)

        messages = [
            [
                {
                    "role": "system",
                    "content": [{"type": "text", "text": system_prompt}],
                },
                {
                    "role": "user",
                    "content": [{"type": "text", "text": user_prompt}],
                },
            ],
        ]

        output = self.pipeline(messages, max_new_tokens=50)
        result = output[0][0]["generated_text"][-1]["content"].strip()
        return result