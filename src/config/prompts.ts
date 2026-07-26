export interface PromptChallenge {
  id: string;
  title: string;
  scenario: string;
  promptA: string;
  promptB: string;
  resultA: string;
  resultB: string;
  correct: "A" | "B";
  principle: string;
  difficulty: "Beginner" | "Intermediate";
}

export const promptChallenges: PromptChallenge[] = [
  {
    id: "pc1",
    title: "The Story Starter",
    scenario: "You want the AI to write a short story about a brave robot.",
    promptA: "write story robot",
    promptB: "Write a 5-sentence bedtime story about a brave robot who helps a lost child find their way home.",
    resultA: "robot. story. the end. \u2014 Not much happened...",
    resultB: "Once upon a time, a small robot named Bolt found a child crying in the forest. Bolt's heart glowed blue, and he carried the child home through the storm. In the morning, the child woke up safe, and Bolt became a hero.",
    correct: "B",
    principle: "Specificity wins. The more detail, context, and constraints you give, the better the result. Tell the AI the format, length, tone, and subject.",
    difficulty: "Beginner",
  },
  {
    id: "pc2",
    title: "The Homework Helper",
    scenario: "You want the AI to explain photosynthesis simply.",
    promptA: "Explain photosynthesis like I'm 10 years old, using a step-by-step list with a fun analogy.",
    promptB: "photosynthesis explain",
    resultA: "Think of a leaf like a tiny kitchen! Here's how it makes food:\n1. Sunlight is the oven's heat\n2. Water comes up from the roots like a tap\n3. Air (CO\u2082) comes in through tiny doors\n4. The leaf cooks them into sugar \u2014 plant food!\n5. Out comes oxygen, the air we breathe",
    resultB: "Photosynthesis is when plants make food from light, water, and CO\u2082. \u2014 (A bit dry and unclear.)",
    correct: "A",
    principle: "Role and format matter. Asking the AI to explain 'like I'm 10' and use a 'step-by-step list with an analogy' shapes both the tone and structure of the answer.",
    difficulty: "Beginner",
  },
  {
    id: "pc3",
    title: "The Code Request",
    scenario: "You want the AI to write a Python function that greets a user.",
    promptA: "give me code",
    promptB: "Write a Python function called greet(name) that returns a friendly greeting message. Include a docstring and handle the case where name is empty.",
    resultA: "print('hello') \u2014 That's all you got.",
    resultB: "def greet(name):\n    \"\"\"Return a friendly greeting for the given name.\"\"\"\n    if not name:\n        return \"Hello, friend!\"\n    return f\"Hello, {name}! Welcome aboard!\"",
    correct: "B",
    principle: "Be precise about what you want: the language, the function name, the behavior, and the edge cases. A good prompt is a clear specification.",
    difficulty: "Intermediate",
  },
];

export interface LLMConcept {
  id: string;
  term: string;
  emoji: string;
  analogy: string;
  explanation: string;
  gradient: string;
}

export const llmConcepts: LLMConcept[] = [
  { id: "tokens", term: "Tokens", emoji: "\u{1F9E9}", analogy: "Colorful puzzle pieces", explanation: "AI doesn't read words \u2014 it reads tokens, small chunks of text it pieces together like a puzzle.", gradient: "from-emerald-400 to-teal-500" },
  { id: "context", term: "Context Window", emoji: "\u{1F392}", analogy: "A backpack with limited space", explanation: "The AI can only hold so much text in mind at once, like a backpack that can only fit so many books.", gradient: "from-sky-400 to-blue-500" },
  { id: "embeddings", term: "Embeddings", emoji: "\u2B50", analogy: "Stars connected by similarity", explanation: "Words become points in space. Similar meanings sit close together like neighboring stars.", gradient: "from-violet-400 to-purple-500" },
  { id: "memory", term: "Memory", emoji: "\u{1F4DA}", analogy: "Books on a library shelf", explanation: "AI can remember things you told it, shelving them like books it can pull down later.", gradient: "from-amber-400 to-orange-500" },
  { id: "hallucinations", term: "Hallucinations", emoji: "\u{1F300}", analogy: "Dreaming with confidence", explanation: "Sometimes the AI makes things up, stating them confidently. It's dreaming, not lying \u2014 always verify.", gradient: "from-rose-400 to-pink-500" },
  { id: "retrieval", term: "Retrieval (RAG)", emoji: "\u{1F50D}", analogy: "Looking up answers in an encyclopedia", explanation: "Before answering, the AI looks things up from a trusted source \u2014 like checking an encyclopedia first.", gradient: "from-cyan-400 to-teal-500" },
];
