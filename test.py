from transformers import pipeline

generator = pipeline("text-generation", model="distilgpt2")
result = generator("Success means", max_length=30)

print(result[0]["generated_text"])
