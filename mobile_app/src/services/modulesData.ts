export interface TheorySection {
  subtitle: string;
  body: string;
  code?: string;
}

export interface TheoryModule {
  id: number;
  title: string;
  tag: string;
  overview: string;
  explanation: string;
  code: string;
  visual: string;
  sections?: TheorySection[];
  recap?: string;
  hook?: string;
}

export const theoryModules: TheoryModule[] = [
    {
        id: 1,
        title: "Foundations of AI & Machine Learning",
        tag: "FOUNDATIONS",
        overview: "An introduction to AI, ML paradigms, and mathematical foundations.",
        explanation: "AI mimics human cognitive functions. It relies on data, algorithms, and computing power to solve complex real-world problems.",
        code: ``,
        visual: "Types of AI: Narrow AI, General AI (AGI), Super AI.",
        sections: [
            {
                subtitle: "1.1 Introduction to Artificial Intelligence",
                body: "AI is a broad field concerned with building systems that can perform tasks requiring human intelligence. Modern AI is built on data, algorithms, and computing power (GPUs/TPUs).\n\nTypes of AI\n• Narrow AI (Weak): Designed for specific tasks (used today).\n• General AI (AGI): Can perform any human intellectual task (hypothetical).\n• Super AI: Surpasses human intelligence.\n\nApplications of AI\nSpans healthcare (diagnosis), finance (trading), transportation (self-driving), NLP, computer vision, and more.",
                code: ``
            },
            {
                subtitle: "1.2 Machine Learning Basics",
                body: "ML enables systems to learn patterns from data and improve without explicit programming.\n\nTypes of ML\n• Supervised: Labeled data (regression/classification).\n• Unsupervised: Unlabeled data (clustering, PCA).\n• Reinforcement: Agent learns via rewards/penalties.\n\nTraining vs Inference\nTraining is intensive learning from data. Inference is deploying the model for new predictions.\n\nOverfitting & Underfitting\nOverfitting: Learns noise too well, generalizes poorly. Underfitting: Too simple to capture patterns.",
                code: `from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np

# Sample supervised learning (Linear Regression)
X = np.array([[1], [2], [3], [4], [5], [6], [7], [8]])
y = np.array([2.5, 4.0, 5.5, 7.0, 8.5, 10.0, 11.5, 13.0])

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
model = LinearRegression()
model.fit(X_train, y_train)

print('Predictions:', model.predict(X_test))`
            },
            {
                subtitle: "1.3 Mathematics for AI",
                body: "Linear Algebra: Vectors and Matrices\nLinear algebra is the backbone of ML. Operations like dot products and matrix multiplications occur millions of times during training.\n\nProbability and Statistics\nProbability handles uncertainty. Bayes' Theorem is crucial for updating beliefs given new evidence.\n\nCalculus\nCalculus optimizes models. Derivatives guide Gradient Descent to iteratively adjust parameters toward minimum loss.",
                code: `import numpy as np
from scipy import stats

# Dot product and matrix multiplication
v1 = np.array([1, 2, 3])
v2 = np.array([4, 5, 6])
print('Dot product:', np.dot(v1, v2)) # 32

# Normal distribution
data = np.random.normal(0, 1, 1000)
print(f'Mean: {np.mean(data):.3f}, Std: {np.std(data):.3f}')`
            }
        ]
    },
    {
        id: 2,
        title: "Python for AI",
        tag: "PROGRAMMING",
        overview: "Core Python concepts and essential numerical data libraries for AI.",
        explanation: "Python is the heartbeat of AI, offering simple syntax and a massive ecosystem of specialized math and ML libraries.",
        visual: "Python Data Stack: Python Core -> NumPy -> Pandas -> Matplotlib",
        code: ``,
        sections: [
            {
                subtitle: "2.1 Core Python for AI",
                body: "Python's dynamic typing, clean syntax, and notebooks make it ideal for rapid experimentation.\nConcepts central to AI coding: Variables, Dictionaries, List Comprehensions, Loops, and Functions.",
                code: `# List comprehension (very common in AI code)
squared = [x**2 for x in range(1, 6)]
print(squared)  # [1, 4, 9, 16, 25]

# Lambda functions
normalize = lambda x, min_val, max_val: (x - min_val) / (max_val - min_val)`
            },
            {
                subtitle: "2.2 Libraries for AI",
                body: "NumPy\nFoundational library for numerical computing. Features the N-dimensional array and supports extreme fast vectorized ops via C backends.\n\nPandas\nGo-to library for data manipulation. Supplies Series and DataFrames to clean, group, and query big tables easily.\n\nMatplotlib & Seaborn\nVisualization frameworks to plot loss curves, heatmaps, and data distributions.",
                code: `import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Numpy math
arr = np.array([1.0, 2.0, 3.0, 4.0])
print('Mean:', np.mean(arr), 'Max:', np.max(arr))

# Pandas DataFrame
df = pd.DataFrame({'age': [25, 32, 28], 'income': [50000, 75000, 60000]})
print(df.describe())

# Matplotlib Line chart
plt.plot([1, 2, 3], [10, 20, 15], 'b-')
plt.title('Sample Plot')
plt.show()`
            }
        ]
    },
    {
        id: 3,
        title: "Deep Learning Fundamentals",
        tag: "NEURAL NETWORKS",
        overview: "Building blocks of Neural Networks, optimization, and backpropagation.",
        explanation: "Neural Networks simulate biological neurons, passing data through connected layers to extract patterns.",
        visual: "Input Vector -> Hidden Layer 1 -> Hidden Layer 2 -> Output Prediction",
        code: ``,
        sections: [
            {
                subtitle: "3.1 Neural Networks",
                body: "Biological Inspiration\nArtificial neurons (perceptrons) calculate a weighted sum of inputs plus bias, passing it through an activation function.\n\nNetworks organized in multiple layers learn hierarchical representations.",
                code: `import numpy as np

class Perceptron:
    def __init__(self, n_inputs, lr=0.1):
        self.weights = np.random.randn(n_inputs)
        self.bias = 0.0; self.lr = lr

    def predict(self, x): return 1 if np.dot(self.weights, x) + self.bias > 0 else 0

p = Perceptron(2)
# predict logic...`
            },
            {
                subtitle: "3.2 Activation Functions",
                body: "Introduce critical non-linearity into networks.\n• ReLU: f(x) = max(0, x). Most common.\n• Sigmoid: Maps to (0, 1).\n• Tanh: Maps to (-1, 1).",
                code: `import numpy as np
def relu(x): return np.maximum(0, x)
def sigmoid(x): return 1 / (1 + np.exp(-x))`
            },
            {
                subtitle: "3.3 Training Neural Networks",
                body: "Loss Functions\nMeasures error (MSE for regression, BCE for classification).\n\nBackpropagation\nUses the Chain Rule to trace error backward across layers, finding exactly how much to adjust each weight.",
                code: `def mse(y_true, y_pred):
    return np.mean((y_true - y_pred) ** 2)`
            },
            {
                subtitle: "3.4 Gradient Descent Optimization",
                body: "Grad Descent takes small steps towards the minimum loss. Mini-batch mode processes data in small chunks for efficiency.",
                code: `# W -= lr * dW\n# b -= lr * db`
            },
            {
                subtitle: "3.5 Deep Learning Frameworks",
                body: "TensorFlow & Keras by Google for production apps. PyTorch by Meta for intuitive, dynamic graph execution heavily used in research.",
                code: `import torch.nn as nn
model = nn.Sequential(
    nn.Linear(784, 128),
    nn.ReLU(),
    nn.Linear(128, 10)
)`
            }
        ]
    },
    {
        id: 4,
        title: "Natural Language Processing (NLP)",
        tag: "LANGUAGE",
        overview: "Processing, representing, and analyzing human language datastreams.",
        explanation: "NLP involves breaking text into tokens, mapping them into dimensions, and feeding them through sequence-aware networks.",
        visual: "Text -> Tokens -> Vectors -> LSTM -> Output",
        code: ``,
        sections: [
            {
                subtitle: "4.1 Text Processing",
                body: "Tokenization: Splitting text into words/subwords.\nStopwords & Stemming: Removing noisy words ('the', 'is') and reducing words to root forms ('running' -> 'run').",
                code: `import re
text = "The quick brown fox"
tokens = text.lower().split()
print(tokens)`
            },
            {
                subtitle: "4.2 Text Representation",
                body: "Bag of Words / TF-IDF: Counts occurrences. TF-IDF penalizes widely common words.\nWord Embeddings (Word2Vec/GloVe): Dense vectors mapping semantic meaning. Similar meanings cluster in multi-dimensional space.",
                code: `from sklearn.feature_extraction.text import TfidfVectorizer
corpus = ['I love machine learning']
tfidf = TfidfVectorizer()
X = tfidf.fit_transform(corpus)`
            },
            {
                subtitle: "4.3 Sequence Models",
                body: "RNNs: Maintain hidden state to remember previous words.\nLSTMs: Improve on RNNs by using 'gates' to preserve long-term context without gradients vanishing.",
                code: `import tensorflow.keras.layers as layers
# LSTM layer
layers.LSTM(64, return_sequences=True)`
            }
        ]
    },
    {
        id: 5,
        title: "Transformers & Modern NLP",
        tag: "ARCHITECTURES",
        overview: "The revolutionary architecture underpinning modern ChatGPT-era models.",
        explanation: "Transformers ditched recursion for parallel 'Attention'. This let models scale limitlessly and understand vast contexts simultaneously.",
        visual: "Query + Key => Attention Weight * Value",
        code: ``,
        sections: [
            {
                subtitle: "5.1 Attention Mechanism",
                body: "Self-Attention allows models to directly focus on any part of the prior text to gather context. It calculates Query, Key, and Value vectors to weigh how important every single token is to every other token simultaneously.",
                code: `def scaled_dot_product_attention(Q, K, V):
    scores = np.matmul(Q, K.T) / np.sqrt(Q.shape[-1])
    weights = softmax(scores)
    return np.matmul(weights, V)`
            },
            {
                subtitle: "5.2 Transformer Architecture",
                body: "Composed of Encoders (for mapping) and Decoders (for generation). It relies upon Positional Encodings to remember sequential order since operations are inherently parallel.",
                code: `# Positional encodings mix Sines & Cosines to inject position data`
            },
            {
                subtitle: "5.3 Pretrained Models",
                body: "BERT: Encoder-only. Excels at context, text classification, and entity recognition.\nGPT: Decoder-only. Excels at open-ended generative text predicting the next token.\nT5: Frame everything as Text-to-Text inference.",
                code: `from transformers import pipeline
generator = pipeline('text-generation', model='gpt2')
generator('AI will', max_length=20)`
            }
        ]
    },
    {
        id: 6,
        title: "Generative AI Concepts",
        tag: "GENERATIVE",
        overview: "Moving from discrimination (labeling) to generation (creation).",
        explanation: "Generative models learn complex data distributions, then sample from them to create completely brand new, statistically viable, human-like content.",
        visual: "Random Noise (Input) -> Denoising Network -> Clear HD Image",
        code: ``,
        sections: [
            {
                subtitle: "6.1 What is Generative AI?",
                body: "Discriminative models draw boundaries (Cat vs Dog). Generative models create data (Draw a Cat). They span Text, Images, Video (Sora), and Audio (MusicLM).",
                code: ``
            },
            {
                subtitle: "6.2 Types of Generative Models",
                body: "GANs (Generative Adversarial Nets): Forger vs Police architecture. Great but unstable.\nVAEs (Variational Autoencoders): Encodes data into a probabilistic latent space.\nDiffusion Models: Gradually destroys data with noise, learns to reverse it (denoising). Underpins Stable Diffusion and Midjourney.",
                code: `import torch, torch.nn as nn
# Simple GAN Generator
class Generator(nn.Module):
    def __init__(self):
        super().__init__()
        self.model = nn.Sequential(nn.Linear(100, 256), nn.ReLU(), nn.Linear(256, 784))
    def forward(self, z): return self.model(z)`
            }
        ]
    },
    {
        id: 7,
        title: "Large Language Models (LLMs)",
        tag: "LLMs",
        overview: "The core mechanics of autoregressive billion-parameter language engines.",
        explanation: "LLMs ingest billions of documents to perfectly predict the statistical next token in text sequences.",
        visual: "Context -> Predict Token -> Append -> Context ...",
        code: ``,
        sections: [
            {
                subtitle: "7.1 LLM Fundamentals",
                body: "Tokenization: Uses Subword (BPE) to condense vocabularies to ~50k tokens.\nContext Window: The absolute limit of memory for inference (Ranges from 8k to 1M+ tokens in Gemini 1.5).\nPrompt Cycle: They predict the next token continuously.",
                code: ``
            },
            {
                subtitle: "7.2 Prompt Engineering",
                body: "Zero-Shot: Instruction with zero examples.\nFew-Shot: Injecting 2-5 examples contextually.\nChain of Thought: Forcing the AI to 'think step by step' greatly boosts its logical capability.",
                code: `cot_prompt = '''\nSolve step by step:\nA train leaves A at 60 mph.\nStep 1: Identify speeds.\nStep 2: Add ...\n'''`
            },
            {
                subtitle: "7.3 Fine-Tuning LLMs",
                body: "Updating a pre-trained model on fresh data. LoRA (Low-Rank Adaptation) freezes the base model and trains tiny matrix adapters on consumer GPUs, saving massive compute.",
                code: `from peft import LoraConfig
lora_config = LoraConfig(r=16, lora_alpha=32, target_modules=['q_proj', 'v_proj'])
# Trains mere fractions of total weights!`
            }
        ]
    },
    {
        id: 8,
        title: "Retrieval-Augmented Generation (RAG)",
        tag: "RAG",
        overview: "Injecting external private databases securely into LLM context windows.",
        explanation: "RAG fixes facts and halts hallucination by performing semantic searches on documents BEFORE passing user questions to the AI.",
        visual: "Query -> Vector Database -> Retrieve Context -> Synthesize Prompt -> LLM",
        code: ``,
        sections: [
            {
                subtitle: "8.1 RAG Concepts",
                body: "Connects frozen knowledge bases to dynamic external data. Fixes out-of-date training data issues.",
                code: ``
            },
            {
                subtitle: "8.2 Vector Databases",
                body: "Databases (Chroma, Pinecone) search high-dimensional similarities (ANN) millions of times faster than standard queries.",
                code: `import chromadb
client = chromadb.Client()
collection = client.create_collection('knowledge_base')
# collection.add(embeddings=...)`
            },
            {
                subtitle: "8.3 Building RAG Pipelines",
                body: "Chunks docs (300-500 tokens). Embeds chunks. Stashes them. When querying, pulls the Top-K chunks and adds to the prompt.",
                code: `from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
chunks = splitter.split_text(long_doc)`
            }
        ]
    },
    {
        id: 9,
        title: "GenAI Tools & Frameworks",
        tag: "ECOSYSTEM",
        overview: "Working properly with APIs, Langchain, and deploying visual apps.",
        explanation: "We move out of raw python notebooks and into production level stacks using Langchain and FastAPI.",
        visual: "Langchain Agent -> OpenAI API -> Streamlit Interface",
        code: ``,
        sections: [
            {
                subtitle: "9.1 APIs and Platforms",
                body: "OpenAI REST APIs handle streaming generation. Hugging Face pipelines grant zero-shot setups natively.",
                code: `from openai import OpenAI
client = OpenAI()
response = client.chat.completions.create(model='gpt-4', messages=[...])`
            },
            {
                subtitle: "9.2 Frameworks (Langchain/LlamaIndex)",
                body: "Langchain builds Agentic pipes binding APIs to data stores and mathematical tools. LCEL syntax orchestrates it.",
                code: `from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory`
            },
            {
                subtitle: "9.3 Deployment",
                body: "Use FastAPI for rapid microservices. Use Streamlit to instantly render python to beautiful interactive frontend web pages.",
                code: `import streamlit as st
st.title('AI App')
text = st.text_area('Input text')
if st.button('Summarize'):
    st.write('Summary response...')`
            }
        ]
    },
    {
        id: 10,
        title: "Image & Multimodal Generation",
        tag: "VISION",
        overview: "Cross-domain generation between texts, images, and audio.",
        explanation: "Multimodal AI perceives reality like humans do. It blends visual perception with language comprehension.",
        visual: "Text 'Cyberpunk City' -> Semantic CLIP Vector -> Diffusion Denoise -> Image",
        code: ``,
        sections: [
            {
                subtitle: "10.1 Image Models",
                body: "Stable Diffusion works within purely Latent space, massively reducing GPU loads compared to rendering raw pixel domains. It utilizes CLIP conditioning from user prompts.",
                code: `from diffusers import StableDiffusionPipeline
pipe = StableDiffusionPipeline.from_pretrained('runwayml/stable-diffusion-v1-5')
pipe('A futuristic city at sunset').images[0].save('img.jpg')`
            },
            {
                subtitle: "10.2 Multimodal / Vision-Language",
                body: "CLIP (Contrastive Language-Image Pre-training) links textual snippets heavily with visual tensors. Allows searching images literally using raw text.",
                code: `# CLIP Zero-Shot Image Classification snippet\n# image_features @ text_features -> matches probability!`
            }
        ]
    },
    {
        id: 11,
        title: "Evaluation & AI Safety",
        tag: "ETHICS",
        overview: "Scoring text correctly and enforcing rigid safety & anti-bias protocols.",
        explanation: "Evaluating Generative text handles ambiguity natively. Safety enforces boundary defenses.",
        visual: "Generated Output -> Evaluation Function & Safety Filter -> Release",
        code: ``,
        sections: [
            {
                subtitle: "11.1 Model Evaluation",
                body: "BLEU: Calculates n-gram overlap. (Translation).\nROUGE: Recall-oriented overlaps (Summarization).",
                code: `from rouge_score import rouge_scorer
scorer = rouge_scorer.RougeScorer(['rouge1', 'rougeL'])
print(scorer.score('He ran fast.', 'The man ran quickly.'))`
            },
            {
                subtitle: "11.2 AI Safety & Ethics",
                body: "Bias: Amplifying training biases. Resolves by curation.\nHallucination: Sounding confident while incorrect. Resolves via RAG.\nModeration: Enforced using RLHF (Reinforcement Learning with Human Feedback).",
                code: `# Bias simulation\n# Group A False Positive Rates vs Group B False Positive Rates`
            }
        ]
    },
    {
        id: 12,
        title: "Optimization & Scaling",
        tag: "SCALING",
        overview: "Making 100B+ parameter models fit on physical hardware securely.",
        explanation: "Techniques shrink floating-point limits and distribute workloads across vast GPU clusters.",
        visual: "16-bit float tensor => bitsnbytes INT-4 compressed tensor",
        code: ``,
        sections: [
            {
                subtitle: "12.1 Performance Optimization",
                body: "Quantization: Crushing FP16 down to INT8 or INT4 to drop VRAM load massively (28GB down to 4GB limits).\nPruning: Disconnecting dead neurons silently.",
                code: `from transformers import BitsAndBytesConfig
bnb_config = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type='nf4')
# Fits a 7B model onto consumer GPUs.`
            },
            {
                subtitle: "12.2 Distributed Systems",
                body: "When one GPU isn't enough, we use FSDP, DeepSpeed, or Accelerate. We perform Pipeline Parallelism (cutting layers across GPUs) or Tensor Parallelism.",
                code: `from accelerate import Accelerator
accelerator = Accelerator()
# model, optimizer = accelerator.prepare(model, optim)`
            }
        ]
    },
    {
        id: 13,
        title: "Deployment & Production",
        tag: "MLOps",
        overview: "From experimental Jupyter Notebooks into live enterprise infrastructure.",
        explanation: "MLOps applies CI/CD software practices directly to inference endpoints ensuring 99% uptimes.",
        visual: "Git Push Model -> Docker Container -> Kubernetes Cloud Endpoints -> End Users",
        code: ``,
        sections: [
            {
                subtitle: "13.1 Cloud Deployment",
                body: "Containerization (Docker): Guarantees consistent environments.\nInference Engines (vLLM / Triton): Maximize memory with continuous batching and page-attention.",
                code: `FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
CMD ["uvicorn", "app:app", "--host", "0.0.0.0"]`
            },
            {
                subtitle: "13.2 Monitoring",
                body: "We monitor latency (p99), token throughput, and Model Drift.\nMLflow seamlessly tracks weights, hyper-parameters, and metrics across experiments.",
                code: `import mlflow
mlflow.set_experiment('iris_classification')
mlflow.log_param('epochs', 10)
mlflow.log_metric('accuracy', 0.95)`
            }
        ]
    },
    {
        id: 14,
        title: "Real-World Applications",
        tag: "AGENTS",
        overview: "Observing live, money-generating apps like ReAct agents and recommendations.",
        explanation: "Modern apps compose tools: taking LLMs out of pure conversation and granting them physical agency.",
        visual: "Agent Observe -> Think -> Act (Google Search) -> Observe",
        code: ``,
        sections: [
            {
                subtitle: "14.1 Agents and Chatbots",
                body: "Agents take a prompt, recognize they need more data, query a search engine, scrape it, and return fully synthesized answers.\nReAct: Reason and Act frameworks loop LLM cognition.",
                code: `from langchain.agents import initialize_agent, AgentType
# Provide Agent with [SearchTool, CalculatorTool]\n# Agent solves mathematical query flawlessly.`
            },
            {
                subtitle: "14.2 Recommendation Systems",
                body: "Powering Netflix and Spotify. Matrices mapping Users to Items perform cosine similarity math to mathematically predict ratings.",
                code: `from sklearn.metrics.pairwise import cosine_similarity
# Generate user-user similarities based on review histories.`
            }
        ]
    },
    {
        id: 15,
        title: "Capstone Projects",
        tag: "PROJECTS",
        overview: "End-to-End full application integrations.",
        explanation: "Connecting every single piece learned.",
        visual: "Project 1 (Chatbot) | Project 2 (RAG)",
        code: ``,
        sections: [
            {
                subtitle: "15.1 Build an LLM Chatbot",
                body: "Write state arrays to hold conversation contexts backwards 10 steps so the AI 'remembers' the thread.",
                code: `class Chatbot:
    def __init__(self):
        self.history = []
    def chat(self, msg):
        self.history.append({'role': 'user', 'content': msg})
        # Call API with full memory payload`
            },
            {
                subtitle: "15.2 RAG Q&A Interface",
                body: "Spinning up ChromaDB locally in memory, ingesting text chunks, producing vectors, injecting prompt templates, reading responses.",
                code: `# Retrieves chunks, sets custom prompt:\n# "Answer based strictly on the provided context."`
            }
        ]
    },
    {
        id: 16,
        title: "Best Practices",
        tag: "SYSTEMS",
        overview: "Professional standards for cost-saving, formatting and securing apps.",
        explanation: "Hiring managers look for developers operating at scale responsibly without draining massive token budgets.",
        visual: "Check Token Sizes => Cache Frequent Queries => Output Format Strictly",
        code: ``,
        sections: [
            {
                subtitle: "16.1 Prompt Guidelines",
                body: "Always strictly designate tone, format, logic, and delimiters. Force structural constraint via JSON when chaining programs.",
                code: `prompt = "Return ONLY a JSON object: { 'name': string, 'age': int }"`
            },
            {
                subtitle: "16.2 Privacy & Optimization",
                body: "Do not pass PII safely to APIs. Utilize exact hashing dictionaries to cache heavy responses.\nPerform token estimations locally via tokenizers to avoid surprise API bill shock.",
                code: `import hashlib
def cached_call(prompt):
    key = hashlib.md5(prompt.encode()).hexdigest()
    if key in cache: return cache[key]
    # else fetch and cache`
            }
        ]
    },
    {
        id: 17,
        title: "Career Path Guidance",
        tag: "CAREER",
        overview: "Navigating the job ecosystem and nailing algorithm assignments.",
        explanation: "Entering the field requires distinct portfolio work to establish engineering trust.",
        visual: "ML Engineer vs Data Scientist vs Prompt Architect",
        code: ``,
        sections: [
            {
                subtitle: "17.1 AI Roles",
                body: "ML Engineer: End to End deployments. CI/CD + Python.\nPrompt Engineer: Systematic optimizations, logic pathways.\nData Scientist: Statistics, querying, EDA.",
                code: ``
            },
            {
                subtitle: "17.2 Portfolios & Open Source",
                body: "Hugging Face spaces and GitHub repos trump basic resumes.\nIn interviews: Execute Backprop by hand, understand Precision/Recall deeply, and write Matrix-math natively.",
                code: `def metrics(y_true, y_pred):
    tp = np.sum((y_pred==1) & (y_true==1))
    fp = np.sum((y_pred==1) & (y_true==0))
    precision = tp / (tp + fp + 1e-8)
    return precision`
            }
        ]
    }
];
