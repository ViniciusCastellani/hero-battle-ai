from transformers import pipeline
from huggingface_hub import login
from dotenv import load_dotenv
import yaml
import torch
import os
import json

class AISelector:
    def __init__(self, user_input):
        load_dotenv()
        self.user_input = user_input
        self.hf_token = os.getenv("HF_TOKEN")

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
        user_prompt = prompt_data["user"]["content"].format(
            user_input=self.user_input
        )

        messages = [
            [
                {"role": "system", "content": [{"type": "text", "text": system_prompt}]},
                {"role": "user", "content": [{"type": "text", "text": user_prompt}]},
            ],
        ]

        output = self.pipeline(messages, max_new_tokens=300)
        cleaned = self.clean_json_output(output)
        return json.loads(cleaned)

    def clean_json_output(self, output):
        raw = output[0][0]["generated_text"][-1]["content"].strip()

        # remove ```json fences
        if raw.startswith("```"):
            raw = raw.split("```", 1)[1].strip()
        if raw.endswith("```"):
            raw = raw.rsplit("```", 1)[0].strip()

        start = raw.find("{")
        end = raw.rfind("}")

        if start == -1 or end == -1:
            raise ValueError("AI output does not contain valid JSON.")

        return raw[start:end+1]