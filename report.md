# Stanford CME 295: Transformers & Large Language Models (Autumn 2025)
## Comprehensive Master Course Report & Curriculum Syllabus

**Course Title:** Stanford CME 295: Transformers & Large Language Models  
**Academic Term:** Autumn 2025 (Stanford University)  
**Instructors:** Afshine Amidi & Shervine Amidi  
**Course Scope:** 9 Full Lectures covering the entire continuum from foundational self-attention mechanics to cutting-edge 2025 agentic systems, reasoning architectures (RL/GRPO), diffusion language models, and hardware co-design.

---

# Table of Contents
1. [Executive Curriculum Overview](#1-executive-curriculum-overview)
2. [Lecture 1: The Transformer Architecture & Foundations](#2-lecture-1-the-transformer-architecture--foundations)
3. [Lecture 2: Transformer-Based Models & Architectural Tricks](#3-lecture-2-transformer-based-models--architectural-tricks)
4. [Lecture 3: Transformers & Large Language Models (MoE, Decoding & Inference Acceleration)](#4-lecture-3-transformers--large-language-models-moe-decoding--inference-acceleration)
5. [Lecture 4: Large Language Model Training (Pre-Training, Distributed Systems & PEFT)](#5-lecture-4-large-language-model-training-pre-training-distributed-systems--peft)
6. [Lecture 5: LLM Tuning (Alignment, RLHF, PPO & Direct Preference Optimization)](#6-lecture-5-llm-tuning-alignment-rlhf-ppo--direct-preference-optimization)
7. [Lecture 6: LLM Reasoning (Test-Time Compute, GRPO & DeepSeek-R1 Architecture)](#7-lecture-6-llm-reasoning-test-time-compute-grpo--deepseek-r1-architecture)
8. [Lecture 7: Agentic LLMs (RAG, Tool Calling, MCP & Autonomous Workflows)](#8-lecture-7-agentic-llms-rag-tool-calling-mcp--autonomous-workflows)
9. [Lecture 8: LLM Evaluation (Human Reliability, LLM-as-a-Judge & Agent Benchmarks)](#9-lecture-8-llm-evaluation-human-reliability-llm-as-a-judge--agent-benchmarks)
10. [Lecture 9: Recap & Current Trends (Multimodal, Diffusion LLMs & Future Frontiers)](#10-lecture-9-recap--current-trends-multimodal-diffusion-llms--future-frontiers)
11. [Master Glossary of Technical Terms](#11-master-glossary-of-technical-terms)
12. [Comprehensive Index of Models, Tools & Benchmarks](#12-comprehensive-index-of-models-tools--benchmarks)

---

# 1. Executive Curriculum Overview

Stanford CME 295 provides an exhaustive, end-to-end mathematical and engineering breakdown of modern transformer architectures and Large Language Models. The curriculum is partitioned into three conceptual phases:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│ PHASE 1: Foundations & Architectures (Lectures 1–3)                             │
│ • NLP Foundations, Embeddings & Scaled Dot-Product Attention                     │
│ • Positional Encodings (Sinusoidal, RoPE), Normalization (RMSNorm), BERT vs GPT  │
│ • Mixture of Experts (MoE), Decoding Strategies & Inference Engines (vLLM, MLA) │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
┌─────────────────────────────────────────▼────────────────────────────────────────┐
│ PHASE 2: Training, Alignment & Reasoning (Lectures 4–6)                          │
│ • Pre-training at Scale, Chinchilla Laws, FlashAttention, Distributed (ZeRO), LoRA│
│ • Alignment: Bradley-Terry, RLHF, PPO (Actor-Critic) vs DPO (Supervised Loss)    │
│ • Reasoning: Test-Time Compute Scaling, GRPO, DAPO, DeepSeek-R1 Recipe          │
└─────────────────────────────────────────┬────────────────────────────────────────┘
                                          │
┌─────────────────────────────────────────▼────────────────────────────────────────┐
│ PHASE 3: Agency, Evaluation & Future Horizons (Lectures 7–9)                     │
│ • RAG (Bi/Cross-Encoders), Function Calling, Model Context Protocol (MCP), ReAct │
│ • Evaluation: Cohen's Kappa, LLM-as-a-Judge, Factuality, Agent Failure Modes     │
│ • Frontier Trends: Vision Transformers, Masked Diffusion LLMs, Analog Hardware   │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

# 2. Lecture 1: The Transformer Architecture & Foundations

### 2.1 Course Objectives, Taxonomy & Prerequisites
* **Course Structure & Logistics:** 2 units; grading based on conceptual understanding (50% Midterm, 50% Final Exam, closed-book/no-code conceptual exams). Open-source VIP Cheat Sheet on GitHub.
* **NLP Task Taxonomy:**
  * *Single-Label Classification:* Sequence-level mapping (sentiment analysis, intent detection, topic routing).
  * *Token-Level / Multi-Classification:* Token-by-token tagging (Named Entity Recognition - NER, Part-of-Speech - POS tagging, dependency syntax parsing).
  * *Sequence Generation (Text-in, Text-out):* Variable-length open autoregressive generation (machine translation, dialogue, summarization, code generation).
* **Evaluation Metrics:**
  * Classification: Accuracy (vulnerable under class imbalance), Precision ($\frac{TP}{TP+FP}$), Recall ($\frac{TP}{TP+FN}$), F1 Score ($2 \cdot \frac{P \cdot R}{P + R}$).
  * Generation: BLEU (n-gram precision with brevity penalty), ROUGE (n-gram recall suite for summarization), Perplexity ($\exp(\text{Cross-Entropy Loss})$, lower is better).

### 2.2 Text Preprocessing & Vector Representations
* **Tokenization Strategies:**
  * *Word-Level:* Intuitive, but explodes vocabulary size ($V \sim 10^6$), cannot share morphological roots ("bear" vs "bears"), frequent Out-Of-Vocabulary (OOV) tokens.
  * *Subword-Level (BPE, WordPiece):* Balances vocabulary size ($30\text{k} - 100\text{k}$) with sequence length; breaks unknown words into morphological constituents; industry standard.
  * *Character-Level:* Zero OOV, robust to typos, but inflates sequence length drastically and individual characters lack semantic priors.
* **Special Tokens:** `<BOS>` / `<s>` (Begin of Sequence), `<EOS>` / `</s>` (End of Sequence), `<UNK>` (Unknown token).
* **Word Embeddings:**
  * *One-Hot Encoding (OHE):* High-dimensional ($V$), sparse, all vectors mutually orthogonal ($\cos\theta = 0$), incapable of capturing semantic similarity.
  * *Distributed Embeddings (Word2Vec, Mikolov 2013):* Continuous low-dimensional dense space ($\mathbb{R}^d$, $d \ll V$).
    * Continuous Bag-of-Words (CBOW): Predicts center token given context window.
    * Skip-Gram: Predicts context window tokens given center target token.
    * Proxy Task Concept: Auxiliary self-supervised objective used to extract internal weight columns as semantic representations.
    * Vector Arithmetic: $\vec{v}_{\text{King}} - \vec{v}_{\text{Man}} + \vec{v}_{\text{Woman}} \approx \vec{v}_{\text{Queen}}$.

### 2.3 Recurrent Neural Networks (RNNs) vs. The Transformer
* **Recurrent Processing:** Hidden state update $h_t = f(h_{t-1}, x_t)$.
* **Three Fatal Failures of RNNs/LSTMs:**
  1. *Information Bottleneck:* Compressing arbitrary sequence history into a fixed-width vector causing catastrophic forgetting.
  2. *Vanishing/Exploding Gradients:* Repeated matrix multiplications over time steps in Backpropagation Through Time (BPTT).
  3. *Lack of Parallelization:* Step $t$ strictly depends on step $t-1$, preventing modern GPU parallel matrix execution.
* **Bahdanau Attention (2014):** Introduced direct, dynamic soft-linking between target decoding steps and all source encoder activations.

### 2.4 The Transformer Architecture (Vaswani et al., 2017)
* **Core Philosophy:** "Attention Is All You Need" — discarding recurrent connections entirely in favor of parallel self-attention.
* **Scaled Dot-Product Attention:**
  $$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$
  * *Query ($Q$):* What a token is searching for.
  * *Key ($K$):* The index/attribute of what a token contains.
  * *Value ($V$):* The actual semantic representation retrieved.
  * *The $\frac{1}{\sqrt{d_k}}$ Scaling Factor:* As dimension $d_k$ grows large, vector dot products grow large in magnitude, pushing softmax inputs into saturation regions with near-zero gradients. Scaling preserves unit variance and stable gradients.
* **Multi-Head Attention (MHA):**
  $$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h)W^O$$
  where $\text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$. Projects tokens into $h$ independent geometric subspaces simultaneously (analogous to multiple convolution kernels in CNNs).
* **Positional Encoding:** Self-attention is permutation-invariant; sinusoidal functions of varying frequencies are added element-wise to token embeddings to encode position.
* **Encoder-Decoder Pipeline:**
  * *Encoder:* Bidirectional self-attention + Position-wise Feed-Forward Network (FFN).
  * *Decoder:* Masked causal self-attention (triangular lower-triangular mask preventing lookahead) + Cross-attention (Queries from decoder, Keys & Values from encoder) + FFN.
  * *Label Smoothing Regularization:* Dampens target confidence by $\epsilon$ to prevent output probability overconfidence.

---

# 3. Lecture 2: Transformer-Based Models & Architectural Tricks

### 3.1 Advanced Positional Encodings
* **Absolute Learned Positional Embeddings:** Learns an embedding vector per absolute position index ($1 \dots N$). Fails to extrapolate beyond maximum training sequence length.
* **Sinusoidal Embeddings:**
  $$\text{PE}_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right), \quad \text{PE}_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$
  Dot product of two position embeddings is a sum of cosines of relative distance $(m - n)$, peaking at $m = n$.
* **Relative Position Bias (T5):** Direct attention logit modification adding a bucketed learned scalar $B_{m,n}$ directly to the attention score: $\text{softmax}\left(\frac{QK^T}{\sqrt{d_k}} + B_{m,n}\right)$.
* **Attention with Linear Biases (ALiBi):** Applies static, non-learned linear penalties proportional to distance $|m - n|$; allows "train short, test long" context extrapolation.
* **Rotary Position Embeddings (RoPE / RoFormer):**
  * Applies an orthogonal 2D rotation matrix to Query and Key vectors in 2D sub-planes:
    $$R_{\theta, m} = \begin{pmatrix} \cos m\theta & -\sin m\theta \\ \sin m\theta & \cos m\theta \end{pmatrix}$$
  * Inner product property: $(R_m Q)^T (R_n K) = Q^T R_{n-m} K$, depending strictly on relative distance $(n - m)$.
  * Possesses the mathematical property of **long-term decay** (attention bound decays as token distance increases). Adopted by LLaMA, Mistral, and DeepSeek.

### 3.2 Normalization Strategies
* **LayerNorm Formulation:** Normalizes across feature dimensions per token:
  $$y = \frac{x - \mu}{\sqrt{\sigma^2 + \epsilon}} \odot \gamma + \beta$$
* **RMSNorm (Root Mean Square Normalization):**
  $$y = \frac{x}{\text{RMS}(x)} \odot \gamma, \quad \text{where } \text{RMS}(x) = \sqrt{\frac{1}{d}\sum_{i=1}^d x_i^2}$$
  Discards mean-centering ($\mu$) and shift parameter ($\beta$), reducing compute overhead and memory traffic while maintaining convergence stability.
* **Post-LN vs. Pre-LN:**
  * *Post-LN (Original):* $x_{l+1} = \text{LayerNorm}(x_l + \text{Sublayer}(x_l))$. Prone to vanishing/exploding gradients in deep models without delicate warmups.
  * *Pre-LN (Modern):* $x_{l+1} = x_l + \text{Sublayer}(\text{LayerNorm}(x_l))$. Provides an uninterrupted identity gradient highway, stabilizing training of deep networks.

### 3.3 Attention Memory Optimizations (KV Cache & Attention Variants)
* **The $O(N^2)$ Bottleneck:** Quadratic scaling of attention matrix computation with sequence length.
* **Sliding Window / Local Attention:** Tokens attend only to neighbors within a local window (e.g., Mistral, Longformer); stacking layers expands receptive field hierarchically.
* **KV Cache:** Persists computed Key ($K$) and Value ($V$) tensors in GPU VRAM across autoregressive generation steps to eliminate redundant recomputation.
* **Attention Head Variants:**
  * *Multi-Head Attention (MHA):* $h$ Query heads, $h$ Key heads, $h$ Value heads.
  * *Multi-Query Attention (MQA):* $h$ Query heads sharing 1 single Key head and 1 single Value head (maximum KV cache savings, minor quality drop).
  * *Grouped-Query Attention (GQA):* $h$ Query heads partitioned into $g$ groups; heads in each group share 1 Key and 1 Value head (optimal trade-off between capacity and inference memory).

### 3.4 Transformer Family Taxonomy & Deep Dive into BERT
* **Taxonomy:**
  * *Encoder-Decoder:* T5 (Text-to-Text Transfer Transformer), mT5, ByT5 (tokenizer-free byte-level modeling). Span corruption objective using sentinel tokens.
  * *Decoder-Only:* GPT family; causal autoregressive generative models.
  * *Encoder-Only:* BERT family; bidirectional representations for classification and extraction.
* **BERT (Bidirectional Encoder Representations from Transformers - Devlin 2018):**
  * Input Representation: Element-wise sum of Token Embedding + Positional Embedding + Segment Embedding (`Segment A` vs `Segment B`).
  * Special Tokens: `[CLS]` (Classification token), `[SEP]` (Segment separator), `[PAD]`, `[MASK]`.
  * Pre-Training Objectives:
    1. *Masked Language Model (MLM):* 15% of tokens selected (80% replaced with `[MASK]`, 10% kept unchanged, 10% replaced with random token).
    2. *Next Sentence Prediction (NSP):* Binary classification on `[CLS]` predicting whether Sentence B follows Sentence A (`IsNext` vs `NotNext`).
* **BERT Evolutions:**
  * *DistilBERT:* Knowledge distillation using teacher soft targets and Kullback-Leibler (KL) Divergence loss; reduces layers by 50% while retaining ~97% performance.
  * *RoBERTa:* Removes NSP, uses dynamic masking, larger batch sizes, and larger training corpora.

---

# 4. Lecture 3: Transformers & Large Language Models (MoE, Decoding & Inference Acceleration)

### 4.1 Definition and Dimensions of LLMs
* **Modern LLM Definition:** Autoregressive decoder-only sequence models with billion+ parameters pre-trained on hundreds of billions to tens of trillions of tokens.
* **Three Axes of Scale:** Parameters ($N$), Training Tokens ($D$), Compute FLOPs ($C$).

### 4.2 Mixture of Experts (MoE) Architecture
* **Motivation:** Decouple total model capacity from per-token forward pass compute (FLOPs).
* **Target Sub-Layer:** Placed inside the Feed-Forward Network (FFN/MLP) blocks, which account for $\sim 2/3$ of all transformer parameters ($D_{\text{model}} \to D_{\text{FF}} \sim 4\times\text{--}8\times D_{\text{model}}$).
* **Mathematical Formulation:**
  $$\hat{y} = \sum_{i=1}^n G(x)_i \cdot E_i(x)$$
  * *Dense MoE:* All experts receive non-zero weights.
  * *Sparse MoE:* Router gate $G(x)$ activates only the Top-$k$ experts (e.g., $k=1$ or $k=2$), setting others to zero.
* **Pathologies & Mitigations:**
  * *Routing Collapse:* Router falls into positive feedback loop routing all tokens to the same 1–2 experts.
  * *Auxiliary Load Balancing Loss:*
    $$\mathcal{L}_{\text{aux}} = \alpha \cdot N \sum_{i=1}^N f_i \cdot P_i$$
    where $f_i$ is fraction of tokens routed to expert $i$, and $P_i$ is average routing probability.
  * *Noisy Gating:* Injecting tunable Gaussian noise into routing logits before softmax to enforce exploratory routing.

### 4.3 Decoding Strategies & Mechanics
* **Greedy Decoding:** Picks $\arg\max P(w_t \mid w_{<t})$ at each step; deterministic, locally optimal, prone to loops and repetitions.
* **Beam Search:** Maintains top-$B$ partial sequence hypotheses using cumulative log-probabilities; applies length normalization ($1/L^\alpha$) to counteract probability decay penalty.
* **Stochastic Sampling:**
  * *Top-$k$ Sampling:* Restricts sampling pool to the $k$ highest-probability tokens.
  * *Top-$p$ (Nucleus) Sampling:* Dynamically samples from the smallest token set $V^{(p)}$ such that $\sum_{w \in V^{(p)}} P(w) \ge p$.
* **Softmax Temperature ($T$):**
  $$P(w_i) = \frac{\exp(z_i / T)}{\sum_j \exp(z_j / T)}$$
  * As $T \to 0$: Probabilities collapse into a one-hot argmax vector (deterministic).
  * As $T \to \infty$: Logits flatten, probabilities approach uniform distribution ($1/|V|$).
* **Hardware Non-Determinism in Inference:** Floating-point reduction ordering across parallel GPU warps/threads causes minor numerical variations, leading to occasional non-deterministic outputs even at $T=0$.
* **Guided / Constrained Decoding:** Intercepts logits using Finite State Machines (FSMs) or Context-Free Grammars (CFGs) to mask out invalid tokens, guaranteeing valid JSON/regex schemas.

### 4.4 Prompting & In-Context Learning (ICL)
* **Prompt Anatomy:** Context (system persona/grounding), Instructions (procedural task), Inputs (dynamic data), Constraints (formatting/safety bounds).
* **Context Rot & "Needle in a Haystack" (NIAH):** Empirical degradation of factual retrieval accuracy as context length expands into hundreds of thousands of tokens, exacerbated by irrelevant distractors.
* **Chain-of-Thought (CoT):** Inducing explicit intermediate reasoning steps; acts as a white-box token debugging interface for human engineers.
* **Self-Consistency:** Sampling $M$ independent reasoning paths at $T > 0$ and aggregating final answers via majority voting.

### 4.5 Inference Acceleration Engines
* **Memory-Bound Bottleneck:** Autoregressive decoding is bottlenecked by GPU memory bandwidth (loading weights and KV cache from VRAM) rather than arithmetic compute.
* **PagedAttention (vLLM):** Solves internal fragmentation (allocating max-length buffers) and external fragmentation (allocator gaps) by partitioning KV caches into non-contiguous fixed-size blocks (e.g., 16 tokens) mapped via virtual-to-physical block tables.
* **Multi-Head Latent Attention (MLA - DeepSeek-V2/V3):** Low-rank joint compression of Keys and Values into a single shared latent vector per token; uncompresses dynamically during attention, slashing KV cache memory footprint by an order of magnitude.
* **Speculative Decoding:** Small "draft model" proposes $k$ candidate tokens rapidly; large "target model" verifies all $k$ tokens in a single parallel forward pass using rejection sampling:
  $$\text{Acceptance Probability} = \min\left(1, \frac{P_{\text{target}}(x)}{P_{\text{draft}}(x)}\right)$$
  Mathematically preserves the exact target output distribution.
* **Multi-Token Prediction (MTP):** Attaches $k$ parallel prediction heads to the base transformer to propose multiple future tokens natively.

---

# 5. Lecture 4: Large Language Model Training (Pre-Training, Distributed Systems & PEFT)

### 5.1 Paradigm Shift & Stage 1: Pre-Training
* **Transfer Learning:** Shift from task-specific models trained from scratch to foundational pre-training on general corpora followed by downstream adaptation.
* **Corpora Scale:** Trillions of tokens (Common Crawl ~3B pages/month, Wikipedia, GitHub, Stack Overflow). Llama 3 trained on 15T tokens.
* **Empirical Scaling Laws:**
  * Kaplan et al. (2020): Power-law scaling relationships between compute, dataset size, and parameter count.
  * Chinchilla Laws (Hoffmann et al., 2022): Compute-optimal pre-training mandates scaling tokens and parameters proportionally ($1:1$ compute ratio), establishing the rule of thumb:
    $$\text{Tokens} \approx 20 \times \text{Parameters}$$
    Proved models like GPT-3 (175B parameters trained on 300B tokens) were severely undertrained.

### 5.2 GPU Memory Footprint & Distributed Systems
* **Memory Allocation Breakdown During Training:**
  1. *Model Parameters* ($W$).
  2. *Activations:* Stored during forward pass for backward gradient computation ($O(N^2)$ due to attention).
  3. *Gradients:* Stored during backpropagation.
  4. *Optimizer States:* E.g., Adam stores 1st moment ($m_t$) and 2nd moment ($v_t$), requiring $8\times$ bytes per parameter in FP32.
* **Distributed Parallelism Frameworks:**
  * *Data Parallelism (DP):* Replicates model weights across GPUs, shards data batches, synchronizes gradients via all-reduce.
  * *ZeRO (Zero Redundancy Optimizer):*
    * ZeRO-1: Shards optimizer states across GPUs ($4\times$ memory reduction).
    * ZeRO-2: Shards optimizer states + gradients ($8\times$ memory reduction).
    * ZeRO-3: Shards optimizer states + gradients + model parameters (enables training models larger than any single GPU).
  * *Model Parallelism:* Tensor Parallelism (TP - intra-layer matrix splitting), Pipeline Parallelism (PP - layer-wise splitting), Expert Parallelism (EP - routing MoE experts across devices).

### 5.3 FlashAttention (Dao et al., 2022)
* **GPU Memory Hierarchy:**
  * High Bandwidth Memory (HBM): Large (~80 GB on H100), slow bandwidth (~few TB/s).
  * Static RAM (SRAM): On-chip, tiny (~tens of MBs), ultra-fast bandwidth (~tens of TB/s, $10\times$ faster).
* **The Memory Wall:** Standard attention repeatedly reads and writes $N \times N$ attention matrices to/from HBM during row-wise softmax normalization.
* **FlashAttention Innovations:**
  1. *Tiling:* Partitions $Q, K, V$ into blocks that fit within SRAM; computes exact online softmax incrementally without materializing the full $N \times N$ matrix in HBM.
  2. *Activation Recomputation:* Drops intermediate attention activations from memory during forward pass and recomputes them on-the-fly in SRAM during backward pass.
  3. *Efficiency Paradox:* Executes more arithmetic operations ($\text{GFLOPs}$) but achieves up to $10\times$ faster wall-clock training by eliminating HBM I/O bottlenecks.

### 5.4 Numerical Precision & Mixed-Precision Training
* **Floating-Point Formats:** FP32 (1 sign, 8 exponent, 23 mantissa), FP16 (1 sign, 5 exponent, 10 mantissa), BF16 (1 sign, 8 exponent, 7 mantissa - matches FP32 dynamic range).
* **Mixed-Precision Training:** Master weights stored in FP32; forward and backward passes computed in BF16/FP16; gradients accumulated and applied to master weights in FP32.

### 5.5 Stage 2: Supervised Fine-Tuning (SFT) & Instruction Tuning
* **Purpose:** Transform raw base autocomplete models into helpful conversational assistants.
* **Loss Masking Formulation:** Standard cross-entropy loss applied *strictly to target response tokens*; prompt tokens are masked out from loss calculation.
* **Data Scale:** Pre-training uses trillions of tokens; SFT uses thousands to low millions of curated examples (e.g., Llama 3 used ~10M SFT examples).
* **Mid-Training:** Emerging intermediate training phase continuing pre-training on high-quality domain-specific corpora (code, math, science).

### 5.6 Parameter-Efficient Fine-Tuning (PEFT): LoRA & QLoRA
* **LoRA (Low-Rank Adaptation - Hu et al., 2021):**
  $$W = W_0 + \Delta W = W_0 + B \cdot A$$
  * Freezes base weight matrix $W_0 \in \mathbb{R}^{d \times k}$.
  * Adds trainable low-rank matrices $B \in \mathbb{R}^{d \times r}$ and $A \in \mathbb{R}^{r \times k}$, with rank $r \ll \min(d, k)$ (typically $r \in [4, 16]$).
  * Key finding: Applying LoRA to Feed-Forward Network (FFN) blocks yields the vast majority of downstream performance gains compared to attention-only adaptation.
* **QLoRA (Dettmers et al., 2023):**
  * Base frozen weights quantized to **4-bit NormalFloat (NF4)** (quantile-based encoding optimal for normally distributed weights).
  * Adapters trained in 16-bit precision (BF16).
  * **Double Quantization (DQ):** Quantizes the quantization constants, reducing memory footprint by ~0.37 bits/parameter.
  * Enables fine-tuning large models on a single consumer GPU.

---

# 6. Lecture 5: LLM Tuning (Alignment, RLHF, PPO & Direct Preference Optimization)

### 6.1 The Need for Preference Tuning
* **Three-Stage Lifecycle:** Pre-training $\to$ Supervised Fine-Tuning (SFT) $\to$ Preference Tuning / Alignment.
* **Why SFT Alone Fails for Alignment:**
  1. *Generation vs. Evaluation Gap:* Easier for humans to judge between two outputs than to write gold-standard demonstrations from scratch.
  2. *Prompt Distribution Fragility:* Adding SFT data for edge cases risks skewing the prompt distribution.
  3. *Lack of Negative Gradients:* SFT only provides positive signal (what to generate); preference tuning provides explicit negative gradients penalizing undesirable outputs (what *not* to generate).

### 6.2 Preference Data Collection
* **Scoring Modalities:** Pointwise (absolute scoring, noisy across raters) vs. Pairwise (head-to-head comparison, high consistency, industry standard) vs. Listwise (full ranking).
* **Pairwise Data Generation:** Prompt $x \to$ sample two completions $y_1, y_2$ at temperature $T > 0 \to$ annotators (human or LLM-as-a-judge) designate winner $y_w$ and loser $y_l$ ($y_w \succ y_l$).

### 6.3 Reinforcement Learning from Human Feedback (RLHF)
* **Formulating LLMs as RL Systems:** State $s_t$ (sequence context so far), Action $a_t$ (next token chosen from vocabulary $\mathcal{V}$), Policy $\pi_\theta(a|s)$ (LLM probability distribution), Reward $R$ (scalar assigned to the completion).
* **Stage 1: Reward Modeling (RM):**
  * Grounded on the **Bradley-Terry preference model**:
    $$P(y_i \succ y_j \mid x) = \frac{\exp(r(x, y_i))}{\exp(r(x, y_i)) + \exp(r(x, y_j))} = \sigma(r(x, y_i) - r(x, y_j))$$
  * Loss Function (Negative Log-Likelihood over preference pairs):
    $$\mathcal{L}_{\text{RM}}(\psi) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}}\left[\log \sigma\Big(r_\psi(x, y_w) - r_\psi(x, y_l)\Big)\right]$$
  * Note: Trained pairwise, but outputs pointwise scalar scores during inference.
* **Stage 2: Policy Optimization via PPO (Proximal Policy Optimization):**
  * Objective: Maximize reward while penalizing drift from reference base model ($\pi_{\text{ref}}$):
    $$\max_\theta \mathbb{E}_{x \sim \mathcal{D}, y \sim \pi_\theta}\left[r(x, y)\right] - \beta D_{\text{KL}}(\pi_\theta(y \mid x) \parallel \pi_{\text{ref}}(y \mid x))$$
  * *Why KL Penalty:* Prevents **Reward Hacking** (exploiting reward model loopholes per Goodhart's Law) and catastrophic forgetting.
  * *PPO-Clip:* Restricts policy ratio $\frac{\pi_\theta}{\pi_{\text{old}}}$ to $[1-\epsilon, 1+\epsilon]$ to prevent destabilizing updates.
  * *Memory Overhead:* Requires **4 active models** in GPU memory concurrently:
    1. Actor / Active Policy Model ($\pi_\theta$, trained).
    2. Critic / Value Model ($V_\phi$, trained).
    3. Reference Model ($\pi_{\text{ref}}$, frozen SFT base).
    4. Reward Model ($r_\psi$, frozen).

### 6.4 Inference-Time Alignment: Best-of-N Sampling (BoN)
* Generates $N$ independent candidate completions at test time; scores each with the reward model; returns candidate with highest reward.
* Bypasses RL training, but incurs $N\times$ compute cost and inflates tail latency (bounded by the slowest completion among $N$ parallel rollouts).

### 6.5 Direct Preference Optimization (DPO - Rafailov et al., 2023)
* **Core Insight:** "Your Language Model is Secretly a Reward Model."
* **Mathematical Derivation:**
  1. The optimal policy under the KL-regularized RL objective has an exact closed-form solution:
     $$\pi^*(y \mid x) = \frac{1}{Z(x)} \pi_{\text{ref}}(y \mid x) \exp\left(\frac{1}{\beta} r(x, y)\right)$$
  2. Inverting for implicit reward:
     $$r(x, y) = \beta \log \frac{\pi^*(y \mid x)}{\pi_{\text{ref}}(y \mid x)} + \beta \log Z(x)$$
  3. Substituting into the Bradley-Terry preference model causes the partition function $Z(x)$ to cancel out completely:
     $$r(x, y_w) - r(x, y_l) = \beta \log \frac{\pi^*(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi^*(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}$$
  4. Final Supervised DPO Loss:
     $$\mathcal{L}_{\text{DPO}}(\theta; \pi_{\text{ref}}) = -\mathbb{E}_{(x, y_w, y_l) \sim \mathcal{D}}\left[\log \sigma\left(\beta \log \frac{\pi_\theta(y_w \mid x)}{\pi_{\text{ref}}(y_w \mid x)} - \beta \log \frac{\pi_\theta(y_l \mid x)}{\pi_{\text{ref}}(y_l \mid x)}\right)\right]$$
* **Comparison:** DPO requires only 2 models in memory ($\pi_\theta, \pi_{\text{ref}}$) and avoids RL instability, but is susceptible to offline distribution shift compared to on-policy PPO.

---

# 7. Lecture 6: LLM Reasoning (Test-Time Compute, GRPO & DeepSeek-R1 Architecture)

### 7.1 Reasoning Models vs. Vanilla LLMs
* **Vanilla LLMs:** Generate immediate outputs token-by-token; excel at syntax and translation, but fail at multi-step math and competitive coding because local next-token prediction cannot plan ahead.
* **Reasoning Models:** Spend **test-time compute** generating hidden intermediate reasoning chains (thought tokens) before producing user-facing answers.
* **Milestones:** OpenAI `o1` (Sept 2024), Gemini 2.0 Flash Thinking (Dec 2024), DeepSeek-R1 (Jan 2025).

### 7.2 Quantitative Reasoning Metrics & Hyperparameters
* **pass@k Metric Formulation:** Generating $n$ samples ($n \ge k$) where $c$ are correct:
  $$\text{pass@k} = 1 - \frac{\binom{n-c}{k}}{\binom{n}{k}} = 1 - \frac{\prod_{j=0}^{k-1}(n - c - j)}{\prod_{j=0}^{k-1}(n - j)}$$
* **Temperature Dynamics:** $T=0$ yields flat pass@k; $T > 1.2$ degrades token probabilities; $T \approx 0.4\text{--}0.8$ balances diversity and correctness.
* **consensus@k:** Majority vote across $k$ generated reasoning chains.

### 7.3 Group Relative Policy Optimization (GRPO)
* **The PPO Bottleneck:** PPO requires a Critic/Value network of comparable size to the policy, doubling memory requirements.
* **GRPO Innovation (DeepSeek):** Completely eliminates the Critic network.
* **Mechanism:**
  * Samples a group of $G$ completions $\{o_1, \dots, o_G\}$ for prompt $q$.
  * Computes group-normalized relative advantage:
    $$A_i = \frac{r_i - \text{mean}(\{r_1, \dots, r_G\})}{\text{std}(\{r_1, \dots, r_G\})}$$
  * Uses **verifiable reward functions** (math answer equivalence, code unit-test execution) without needing learned reward models.
* **Length Bias Pathology in GRPO:**
  * Token gradients are scaled by $\frac{1}{|o_i|}$.
  * For incorrect outputs ($A_i < 0$), short responses receive a large penalty ($\frac{1}{\text{small}}$), while long responses receive a small penalty ($\frac{1}{\text{large}}$).
  * Models learn to generate bloated, rambling reasoning chains when uncertain to hedge against penalties.
* **2025 Mitigations:**
  * **DAPO (March 2025):** Replaces output-specific length normalizer $\frac{1}{|o_i|}$ with a global token normalizer.
  * **Dr. GRPO ("GRPO Done Right"):** Eliminates the length normalization factor entirely.

### 7.4 Case Study: The DeepSeek Recipe
* **DeepSeek-V3 Base:** 671B MoE architecture with Multi-Head Latent Attention (MLA).
* **DeepSeek-R1-Zero (Pure RL Discovery):**
  * Base model trained directly with GRPO with **zero prior SFT**.
  * Rewards: Rule-based accuracy + formatting (`<think>` and `<answer>`).
  * Emergence: Spontaneous self-reflection, backtracking, and "aha moments", but suffered from language mixing and poor readability.
* **DeepSeek-R1 (Full 4-Stage Pipeline):**
  1. *Cold-Start SFT:* Thousands of human-curated, readable CoT examples.
  2. *Reasoning RL:* GRPO with accuracy reward + formatting reward + language consistency reward.
  3. *Rejection Sampling & Large-Scale Mixed SFT:* ~800k curated examples (~600k verified reasoning + ~200k general instruction data).
  4. *All-Scenario RL:* Secondary RL stage combining verifiable rewards with helpfulness and harmlessness rewards (applied to thinking tokens).
* **Reasoning Distillation:** Training small dense models (1.5B–70B) via standard SFT on reasoning trajectories generated by the 671B teacher model; substantially outperforms training small models directly with RL from scratch.

---

# 8. Lecture 7: Agentic LLMs (RAG, Tool Calling, MCP & Autonomous Workflows)

### 8.1 Retrieval-Augmented Generation (RAG)
* **Motivation:** Overcoming knowledge cutoffs, context window limits, cost of massive prompt stuffing, and "Needle in a Haystack" degradation.
* **Knowledge Ingestion Pipeline:** Document chunking (~500 tokens), chunk overlap (low hundreds of tokens), dense vector embedding generation (~1500 dims).
* **Two-Stage Retrieval Architecture:**
  * *Stage 1: Candidate Retrieval (High Recall):* Bi-encoders (e.g., Sentence-BERT) compute dense embeddings independently for fast cosine/ANN similarity search.
  * *Stage 2: Reranking (High Precision):* Cross-encoders concatenate query and candidate chunks through deep attention layers for fine-grained interaction scoring.
* **Advanced Retrieval Techniques:**
  * *BM25 + Dense Hybrid Search:* Combines dense semantic matching with sparse lexical keyword matching.
  * *HyDE (Hypothetical Document Embeddings):* LLM generates a synthetic answer first; synthetic passage is embedded to match against corpus documents.
  * *Contextual Retrieval:* Prepending an LLM-generated document summary to each chunk before embedding.
  * *Prompt Caching:* Caching KV activations of static prompt prefixes in GPU memory, slashing input costs by ~90%.
* **Retrieval Metrics:** NDCG@k (position-discounted relevance), MRR ($1/\text{rank}$ of first relevant doc), Precision@k, Recall@k; evaluated on the MTEB benchmark.

### 8.2 Tool Calling & Function Calling
* **3-Stage Workflow:**
  1. *Tool Prediction:* Model reads prompt + tool API schemas (signatures, parameter schemas, docstrings) and outputs structured function arguments.
  2. *Tool Execution:* Host system executes function locally or via external API, returning structured data (JSON/dataclass).
  3. *Final Response Generation:* Model synthesizes natural language response using conversation history and tool output.
* **Tool Routing:** In large tool catalogs, a lightweight selector model filters down to relevant tools before passing full schemas to the main execution model.
* **Model Context Protocol (MCP - Anthropic):** Open standard decoupling LLM clients from tool servers; standardizes Tools, Prompts, and Resources across hosts.

### 8.3 Autonomous Agents & Multi-Agent Workflows
* **Agent Definition:** An autonomous system pursuing multi-step goals through iterative reasoning loops and environment interactions.
* **ReAct Framework (Yao et al., 2022):**
  $$\text{Observe / Think} \longrightarrow \text{Plan} \longrightarrow \text{Act} \longrightarrow \text{Repeat}$$
* **Google Agent2Agent (A2A) Protocol:** Standardized communication protocol for multi-agent systems defining skill declarations, execution state tracking, and cancellation interfaces.
* **Agent Safety & Vulnerabilities:** Data exfiltration via indirect prompt injection (e.g., untrusted content tricking email tools into leaking private credentials); evaluated via ToolSword and Agent Safety Bench.

---

# 9. Lecture 8: LLM Evaluation (Human Reliability, LLM-as-a-Judge & Agent Benchmarks)

### 9.1 Human Evaluation & Inter-Rater Reliability
* **Raw Agreement Fallacy:** Two raters scoring binary outcomes produce substantial agreement by chance alone:
  $$\text{Agreement}_{\text{chance}} = P(A=1)P(B=1) + P(A=0)P(B=0) = (0.5)^2 + (0.5)^2 = 50\%$$
* **Chance-Adjusted Coefficients:**
  * *Cohen's Kappa ($\kappa$):*
    $$\kappa = \frac{P_o - P_e}{1 - P_e}$$
    where $P_o$ is observed agreement and $P_e$ is chance agreement.
  * *Fleiss's Kappa:* Generalizes to $> 2$ raters.
  * *Krippendorff's Alpha ($\alpha$):* Robust to missing data and arbitrary measurement scales.
* **Agreement Sessions:** Calibration sessions held when $\kappa$ drops below acceptable thresholds to align scoring criteria.

### 9.2 Rule-Based Metrics & Legacy NLP Failures
* **METEOR:** Computes unigram F-score incorporating stem and synonym matching, penalized by contiguous chunk fragmentation: $\text{Score} = F_{\text{mean}} \cdot (1 - \text{Penalty})$.
* **BLEU:** Precision-oriented n-gram overlap penalized by Brevity Penalty ($BP$).
* **ROUGE:** Recall-oriented n-gram overlap.
* **Why Rule-Based Metrics Fail on LLMs:** Inability to handle semantic paraphrasing, poor correlation with human judgment, and reliance on expensive human reference texts.

### 9.3 LLM-as-a-Judge Framework
* **Configuration:** Evaluator model receives `(User Prompt, Candidate Response, Evaluation Rubric)` and outputs `(Natural Language Rationale, Quantitative Score)`.
* **Rationale-First Generation:** Forcing the judge to verbalize critiques *before* outputting numerical scores significantly improves scoring accuracy and calibration.
* **Enforcing Structure:** Using Constraint-Guided Decoding at inference time to guarantee schema compliance.
* **Judge Biases & Mitigations:**
  * *Position Bias:* Favoring the first option in pairwise comparisons $\to$ mitigated by order swapping and score averaging.
  * *Verbosity Bias:* Favoring longer responses $\to$ mitigated by explicit conciseness instructions and length penalties.
  * *Self-Enhancement Bias:* Favoring outputs from the same model family $\to$ mitigated by disjoint evaluator policies (never evaluate a model with itself).

### 9.4 Atomic Factuality Verification (Long-Form Text)
1. **Fact Extraction:** Decomposes paragraph into $N$ discrete atomic propositions ($f_1, \dots, f_N$).
2. **Grounding Verification:** Verifies each proposition independently via RAG or web search ($v_i \in \{0, 1\}$).
3. **Importance Aggregation:**
   $$\text{Factuality Score} = \frac{\sum_{i=1}^N \alpha_i \cdot v_i}{\sum_{i=1}^N \alpha_i}$$
   Preserves nuanced partial correctness across complex multi-sentence paragraphs.

### 9.5 The 7 Practical Agent Failure Modes
| Stage | Failure Mode | Root Cause | Engineering Remedy |
| :--- | :--- | :--- | :--- |
| **Tool Prediction** | **1. Tool Underutilization / Punting** | Tool router recall error or model fails to recognize intent. | Tune router for high recall; add SFT examples for invocation triggers. |
| | **2. Tool Hallucination** | Model calls undefined API name. | Strengthen docstrings; constrain model via system prompt schema. |
| | **3. Wrong Tool Selection** | Overlapping or ambiguous tool definitions. | Disambiguate API contracts; sharpen tool functional boundaries. |
| | **4. Incorrect Arguments** | Missing context in prompt; model invents default values. | Maintain state in context; add prerequisite context-fetching tools. |
| **Tool Execution** | **5. Tool Execution Bug / Crash** | Backend software runtime crash. | Implement standardized error handling; return structured error objects. |
| | **6. Silent / Void Action Execution** | Backend returns `None` without confirming state transition. | Always return structured confirmation payloads; return `{}` instead of `None`. |
| **Synthesis** | **7. Grounding / Synthesis Failure** | Context drowning under massive raw tool output strings. | Trim tool return payloads; use strongly-typed dataclasses/Pydantic schemas. |

### 9.6 Reliability Metrics & Standard Benchmarks
* **$\text{pass}@k$ vs. $\text{pass}^\wedge k$:** $\text{pass}@k$ measures if *at least one* attempt succeeds; $\text{pass}^\wedge k$ ($p^k$) measures if *all* $k$ attempts succeed consistently (essential for enterprise agents).
* **Benchmark Landscape:** MMLU (knowledge), AIME / GSM8K (math), SWE-bench (software engineering), HarmBench (safety), $\tau$-bench (multi-turn agent environments).

---

# 10. Lecture 9: Recap & Current Trends (Multimodal, Diffusion LLMs & Future Frontiers)

### 10.1 Multimodal Transformers (Vision)
* **Vision Transformers (ViT - Dosovitskiy et al., 2020):**
  * Divides 2D image into non-overlapping patches ($P \times P$).
  * Flattens and linearly projects patches into 1D embedding vectors.
  * Prepends a learnable `[CLS]` token and adds 1D positional embeddings.
  * Processes through standard Transformer Encoder layers.
  * *Inductive Bias:* CNNs feature strong local inductive bias (translation invariance, locality); ViTs feature minimal inductive bias, enabling superior performance given sufficient training data.
* **Vision-Language Models (VLMs):**
  * *Token Concatenation (Early Fusion, e.g., LLaVA):* Encodes image patches and concatenates them directly into the text token sequence for a decoder-only LLM.
  * *Cross-Attention Injection (Late Fusion, e.g., Llama 3 Multimodal):* Injects visual representations across cross-attention layers while text streams autoregressively.
* **Generative Vision:** Diffusion Transformers (DiT) and MMDiT replacing traditional convolutional U-Nets.

### 10.2 Diffusion-Based Language Models (dLLMs / MDMs)
* **The Autoregressive Bottleneck:** Autoregressive models require $O(N)$ sequential forward passes at inference time, preventing parallel generation despite parallel training.
* **Discrete Masked Diffusion (Text Diffusion):**
  * *Forward Process:* Incrementally replaces tokens with `[MASK]` across timesteps $t \in [0, T]$ until fully masked.
  * *Reverse Process:* Predicts all unmasked tokens in parallel across a fixed budget of refinement steps.
* **Analogy:** Mirrors drafting a speech—establishing global structure first, then iteratively refining details in parallel (coarse-to-fine generation).
* **Key Advantages:** Decoupled inference latency ($K$ diffusion steps $\ll N$ tokens, yielding up to $10\times$ speedups); native bidirectional context ideal for **Fill-in-the-Middle (FIM)** code completion.
* **Frontier Challenges:** Adapting multi-step reasoning chains to diffusion models; closing benchmark accuracy gaps with frontier autoregressive models.

### 10.3 Cross-Pollination & Architectural Evolutions
* **DeepSeek-OCR:** Encodes dense text into minimal visual patch tokens, bypassing subword tokenization bottlenecks.
* **2D Rotary Position Embeddings (2D-RoPE):** Decomposes rotary angles into orthogonal spatial coordinates for multimodal tokens.
* **Architectural Shifts:**
  * Optimizers: Classical Adam challenged by **Muon** and **MuonClip** (e.g., Kimi K2).
  * Normalization: Universal adoption of Pre-LN and **RMSNorm**.
  * Attention: Transition from MHA to **GQA** and **MLA**.
  * Activations: Transition from ReLU to **GELU** and **SwiGLU**.

### 10.4 The Data Dilemma & Synthetic Collapse
* **The Web Saturation Problem:** Synthetic text comprises an estimated ~80% of new web content.
* **Model Collapse:** Training models recursively on synthetic outputs causes progressive loss of distribution tails, diversity degradation, and functional collapse.
* **Modern Training Pipeline:** Pre-training $\to$ **Mid-training** (massive high-quality curated data) $\to$ Supervised Fine-Tuning $\to$ Preference Tuning.

### 10.5 Hardware-Software Co-Design & Analog Computing
* **Digital Bottlenecks:** GPUs are optimized for General Matrix Multiply (GEMM), while self-attention introduces memory roundtrip bottlenecks ($QK^T$ scaling between HBM and SRAM).
* **Analog Computing Proof-of-Concept:** Hardware computing vector-matrix multiplications directly through analog circuit laws (e.g., Kirchhoff's current law for passive current summation across crossbar arrays) driven by physical voltage pulses, bypassing digital clock cycles and drastically reducing power consumption.

### 10.6 Open Frontiers
* Multi-step agent fragility and compounding error divergence.
* Security: Indirect prompt injection and the need for "HTTPS-like" AI safety certification for autonomous web navigation.
* Continuous lifelong learning without static parameter freezing.
* Disambiguating hallucinations from probabilistic next-token generation.
* Mechanistic interpretability of internal representation dynamics.

---

# 11. Master Glossary of Technical Terms

* **Activation Recomputation (Gradient Checkpointing):** Discarding intermediate activations during forward pass and recomputing them in SRAM during backward pass to reduce GPU memory footprint.
* **ALiBi (Attention with Linear Biases):** Positional technique applying static linear penalties to attention logits proportional to token distance; enables context extrapolation.
* **Auxiliary Load Balancing Loss:** Regularization loss ($\alpha N \sum f_i P_i$) added to MoE training objectives to prevent routing collapse and distribute tokens uniformly across experts.
* **Best-of-N Sampling (BoN):** Inference-time alignment strategy sampling $N$ completions and selecting the one with the highest reward model score.
* **Bradley-Terry Model:** Probabilistic framework modeling pairwise preference as the sigmoid of reward differences: $P(y_w \succ y_l \mid x) = \sigma(r(x, y_w) - r(x, y_l))$.
* **Chinchilla Scaling Laws:** Empirical compute-optimal scaling rule establishing that training tokens should scale proportionally with parameters ($\approx 20:1$ token-to-parameter ratio).
* **Cohen's Kappa ($\kappa$):** Statistical metric measuring inter-rater agreement for qualitative items, corrected for chance agreement: $\frac{P_o - P_e}{1 - P_e}$.
* **Constraint-Guided Decoding:** Masking out invalid token logits during sampling using FSMs/CFGs to guarantee adherence to structured schemas (e.g., JSON).
* **Direct Preference Optimization (DPO):** Closed-form reparameterization converting the KL-regularized RL objective into an exact supervised pairwise cross-entropy loss, eliminating the need for an explicit reward or critic model.
* **Fill-in-the-Middle (FIM):** Generative task conditioning on both preceding and succeeding context to infill missing code or text.
* **FlashAttention:** IO-aware exact attention algorithm tiling computation to fit GPU SRAM and avoiding HBM read/write roundtrips.
* **Group Relative Policy Optimization (GRPO):** Critic-free reinforcement learning algorithm normalizing advantages across a sampled group of completions.
* **Grouped-Query Attention (GQA):** Attention design where multiple query heads share single key/value head pairs to reduce KV cache memory.
* **Knowledge Cutoff Date:** The chronological boundary of pre-training data beyond which a base model has no parametric knowledge.
* **Low-Rank Adaptation (LoRA):** Parameter-efficient fine-tuning decomposing weight updates into low-rank matrices: $\Delta W = B \cdot A$.
* **Model Collapse:** Degeneration of generative models trained recursively on synthetic model-generated data distributions.
* **Multi-Head Latent Attention (MLA):** Compressed KV cache attention mechanism projecting keys and values into a shared low-rank latent vector.
* **PagedAttention:** Memory management algorithm partitioning KV caches into fixed-size physical blocks to eliminate internal and external memory fragmentation.
* **pass@k:** Statistical metric quantifying the probability that at least one of $k$ independent generated attempts succeeds.
* **$\text{pass}^\wedge k$ ("pass hat k"):** Metric measuring the probability that *all* $k$ attempts succeed consistently across repeated trials.
* **Proximal Policy Optimization (PPO):** Policy gradient algorithm constraining policy updates via ratio clipping ($1 \pm \epsilon$) and KL divergence penalties.
* **ReAct (Reason + Act):** Autonomous agent framework interleaving thought generation (Observe/Think, Plan) with environment interactions (Act).
* **Reward Hacking (Goodhart's Law):** Pathology where an RL policy exploits imperfections in a proxy reward function to achieve high scores without fulfilling true user intent.
* **Root Mean Square Normalization (RMSNorm):** Normalization technique scaling vectors by their root-mean-square statistic without mean centering.
* **Rotary Position Embeddings (RoPE):** Multiplying Query and Key vectors by 2D rotation matrices to encode relative position directly into attention inner products.
* **Speculative Decoding:** Acceleration technique where a fast draft model proposes tokens and a large target model verifies them in parallel via rejection sampling.
* **Vision Transformer (ViT):** Encoder-only architecture processing flattened image patches as sequence tokens.
* **ZeRO (Zero Redundancy Optimizer):** Memory optimization sharding optimizer states (ZeRO-1), gradients (ZeRO-2), and parameters (ZeRO-3) across GPUs.

---

# 12. Comprehensive Index of Models, Tools & Benchmarks

### Foundational & Frontier Models
* **BERT / RoBERTa / DistilBERT:** Foundational encoder-only models.
* **GPT Family (GPT-3, GPT-4, GPT-5):** Prototypical causal decoder-only autoregressive LLMs.
* **T5 Family (T5, mT5, ByT5):** Encoder-decoder text-to-text models using span corruption.
* **LLaMA Family (LLaMA 1, 2, 3, 405B):** Open-weight autoregressive models by Meta.
* **DeepSeek Series:**
  * *DeepSeek-V2 / V3:* Frontier MoE models introducing Multi-Head Latent Attention (MLA).
  * *DeepSeek-R1-Zero / R1:* Pioneered pure RL reasoning via GRPO and multi-stage alignment.
  * *DeepSeek-OCR:* Vision model compressing text into visual patch tokens.
* **Claude Family (Anthropic):** Extended thinking models, MCP creator, SWE-bench performance.
* **Gemini Family (Google):** Gemini 2.0 Flash Thinking, Gemini Pro, Pareto-efficient multimodal models.
* **Diffusion LLMs:** LLaDA, experimental Google text diffusion model, Inception Startup model.
* **Kimi K2:** Frontier model pioneering the Muon/MuonClip optimizer.
* **Vision Models:** ViT (Dosovitskiy), LLaVA (multimodal concatenation), DiT / MMDiT (diffusion transformers).

### Systems, Libraries & Hardware
* **Hardware:** NVIDIA H100 GPU (80 GB HBM), Google TPUs, GPU SRAM vs HBM memory subsystems, analog crossbar hardware.
* **Serving & Inference Engines:** vLLM (PagedAttention implementation), Cursor (code-assist agent).
* **Distributed Training:** DeepSpeed ZeRO (Stages 1–3), Tensor/Pipeline/Expert Parallelism.
* **Optimizers & Kernels:** FlashAttention (v1, v2, v3), Adam/AdamW, Muon, MuonClip.
* **Standards & Protocols:** Model Context Protocol (MCP - Anthropic), Agent2Agent Protocol (A2A - Google).

### Benchmarks & Evaluation Suites
* **Knowledge:** MMLU (Massive Multitask Language Understanding).
* **Reasoning & Mathematics:** AIME (American Invitational Mathematics Examination), GSM8K.
* **Coding:** SWE-bench (real-world GitHub issue resolution), HumanEval, Codeforces.
* **Common Sense:** PIQA (Physical Interaction QA), Global PIQA.
* **Safety:** HarmBench, Agent Safety Bench, ToolSword.
* **Agents:** $\tau$-bench ($\tau^2$-bench - airline/retail simulated environments).
* **Retrieval & Embeddings:** MTEB (Massive Text Embedding Benchmark).
* **Crowdsourced:** LMSYS Chatbot Arena (Elo-based blind pairwise comparisons).
