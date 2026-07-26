import type { Lesson } from "./curriculum";

export interface StoryChapter {
  emoji: string;
  text: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface SortItem {
  emoji: string;
  label: string;
  category: string;
}

export interface MatchPair {
  term: string;
  definition: string;
}

export interface LessonContent {
  type: Lesson["type"];
  // Story
  story?: {
    intro: string;
    chapters: StoryChapter[];
    reflection: string;
  };
  // Quiz
  quiz?: {
    questions: QuizQuestion[];
    passingScore: number;
  };
  // Interactive
  interactive?: {
    activity: "sort" | "match" | "explore";
    intro: string;
    // sort
    categories?: string[];
    items?: SortItem[];
    // match
    pairs?: MatchPair[];
    // explore
    hotspots?: { emoji: string; label: string; info: string }[];
  };
  // Challenge
  challenge?: {
    prompt: string;
    hints: string[];
    reflection: string;
  };
  // Mini-game
  miniGame?: {
    gameId: string;
    intro: string;
  };
}

export const lessonContents: Record<string, LessonContent> = {
  // ===== AI FOUNDATIONS =====
  "ai-foundations-1": {
    type: "story",
    story: {
      intro: "Welcome to the Curious Grove, where a small glowing creature called a Sprout wants to learn what AI is. Let's explore together!",
      chapters: [
        { emoji: "\u{1F331}", text: "You meet Sprout, a tiny glowing creature sitting on a leaf. Sprout asks: 'What IS Artificial Intelligence? I keep hearing about it but nobody explains it simply!'" },
        { emoji: "\u{1F9E0}", text: "You think for a moment. 'Well,' you say, 'AI is when we teach computers to do things that usually need human thinking. Like recognizing a face, understanding speech, or deciding what to recommend.'" },
        { emoji: "\u{1F4F1}", text: "Sprout tilts its head. 'Like how my phone knows what song I'll like next?' You nod. 'Exactly! The phone learned patterns from what you tapped before. That's AI at work.'" },
        { emoji: "\u{1F917}", text: "'So AI isn't magic,' Sprout says slowly. 'It's a computer that learned patterns from lots of examples.' You grin. 'Now you're thinking like an AI engineer!'" },
      ],
      reflection: "Think of one app on your phone. How do you think it uses AI?",
    },
  },
  "ai-foundations-2": {
    type: "interactive",
    interactive: {
      activity: "sort",
      intro: "Sort each example into 'How humans learn' or 'How machines learn'. Both use patterns and practice, but there are key differences!",
      categories: ["How humans learn", "How machines learn"],
      items: [
        { emoji: "\u{1F4D6}", label: "Reads books and asks questions", category: "How humans learn" },
        { emoji: "\u{1F4CA}", label: "Processes millions of examples at once", category: "How machines learn" },
        { emoji: "\u{1F914}", label: "Can understand context and emotion", category: "How humans learn" },
        { emoji: "\u26A1", label: "Can train on data in seconds that would take years to read", category: "How machines learn" },
        { emoji: "\u{1F469}\u200D\u{1F3EB}", label: "Learns from a teacher who explains why", category: "How humans learn" },
        { emoji: "\u{1F9EE}", label: "Finds patterns in numbers without being told why", category: "How machines learn" },
      ],
    },
  },
  "ai-foundations-3": {
    type: "quiz",
    quiz: {
      passingScore: 60,
      questions: [
        {
          question: "Which of these uses AI?",
          options: ["A calculator adding 2+2", "Netflix recommending a movie you might like", "A light switch turning on", "A book sitting on a shelf"],
          correct: 1,
          explanation: "Netflix uses AI to learn your watching patterns and recommend movies you'll enjoy. A calculator follows fixed rules — no learning involved!",
        },
        {
          question: "What does AI need to learn?",
          options: ["Magic dust", "Examples and data", "A really fast computer only", "Permission from the government"],
          correct: 1,
          explanation: "AI learns from examples and data — just like you learn from flashcards. The more good examples, the better it learns.",
        },
        {
          question: "Why does a music app suggest songs you'll like?",
          options: ["It reads your mind", "It learned patterns from what you've played before", "It picks randomly", "A human chooses for you"],
          correct: 1,
          explanation: "The AI studied the songs you played, skipped, and liked, then found patterns to predict what else you'd enjoy.",
        },
        {
          question: "Is AI magic?",
          options: ["Yes, definitely magic", "No, it's patterns learned from data", "Sometimes yes, sometimes no", "Nobody knows"],
          correct: 1,
          explanation: "AI is not magic — it's pattern recognition learned from lots of examples. Understanding this makes you an AI creator, not just a user!",
        },
      ],
    },
  },
  "ai-foundations-4": {
    type: "story",
    story: {
      intro: "Sprout has another question. This time it's about the difference between narrow AI and general AI.",
      chapters: [
        { emoji: "\u{1F916}", text: "'I heard there are two kinds of AI,' Sprout says. 'Narrow and General. What's the difference?'" },
        { emoji: "\u{1F3C6}", text: "'Narrow AI,' you explain, 'is really good at ONE thing. Like a chess AI that can beat the world champion but can't tie its shoes. Or a face recognition AI that's amazing at faces but terrible at understanding sentences.'" },
        { emoji: "\u{1F9E0}", text: "'General AI,' you continue, 'would be like a human mind. It could learn anything — chess, faces, language, cooking, even making jokes. Nobody has built General AI yet. It's the dream.'" },
        { emoji: "\u{1F31F}", text: "Sprout's eyes widen. 'So all the AI in the world today is just... narrow?' You nod. 'Every single one. But people are working hard to make it broader. And maybe YOU will help build it!'" },
      ],
      reflection: "If you could build an AI that's amazing at one thing, what would it do?",
    },
  },
  "ai-foundations-5": {
    type: "challenge",
    challenge: {
      prompt: "Think of a problem in your home, school, or community that AI could help solve. Describe the problem and how an AI might help.",
      hints: [
        "Start with a problem you experience every day — like forgetting homework, or your bus being late.",
        "Think about what data the AI would need. Would it need to see images? Read text? Hear sounds?",
        "Remember: the best AI solutions solve real problems for real people.",
      ],
      reflection: "Every great AI builder starts by identifying a problem. You just took the first step!",
    },
  },

  // ===== MACHINE LEARNING =====
  "machine-learning-1": {
    type: "story",
    story: {
      intro: "You arrive in the Data Forest, where trees bear fruit in the shape of data points. A pixel owl watches from a branch.",
      chapters: [
        { emoji: "\u{1F4DA}", text: "The owl blinks slowly. 'Data,' it hoots, 'is the food that feeds every AI. Without data, an AI is just an empty shell.'" },
        { emoji: "\u{1F4CA}", text: "'Think of it like flashcards,' the owl continues. 'If you want to teach a child what a cat is, you show them lots of cat photos. Each photo is a piece of data.'" },
        { emoji: "\u{1F34E}", text: "'But here's the secret,' the owl whispers. 'Not all data is good. Some is rotten, some is confusing, some is biased. The quality of your data decides how smart your AI becomes.'" },
        { emoji: "\u{1F9D0}", text: "'A million bad examples will teach the wrong lesson. But a hundred good examples? That can create something amazing. Remember: garbage in, garbage out!'" },
      ],
      reflection: "If you wanted to teach an AI to recognize your pet, what kind of photos would you collect?",
    },
  },
  "machine-learning-2": {
    type: "interactive",
    interactive: {
      activity: "sort",
      intro: "You're in the Data Forest. Sort each data sample into 'Good training data' or 'Bad training data'. Think about what makes data useful for teaching AI!",
      categories: ["Good training data", "Bad training data"],
      items: [
        { emoji: "\u{1F4D7}", label: "1000 cat photos, many breeds, all lighting", category: "Good training data" },
        { emoji: "\u{1F319}", label: "500 dog photos, all taken at night", category: "Bad training data" },
        { emoji: "\u2705", label: "Photos labeled by 3 people who agreed", category: "Good training data" },
        { emoji: "\u274C", label: "Photos with no labels at all", category: "Bad training data" },
        { emoji: "\u{1F415}", label: "All the same dog from one angle", category: "Bad training data" },
        { emoji: "\u{1F4C8}", label: "Photos sorted by category with clear names", category: "Good training data" },
      ],
    },
  },
  "machine-learning-3": {
    type: "mini-game",
    miniGame: {
      gameId: "train-robot",
      intro: "Time to train your first classifier! Head to the Arcade and play 'Train a Robot'. Label images and watch the AI's accuracy climb. Come back when you've trained it!",
    },
  },
  "machine-learning-4": {
    type: "interactive",
    interactive: {
      activity: "match",
      intro: "Match each AI training term to its definition. These are the building blocks of every machine learning project!",
      pairs: [
        { term: "Dataset", definition: "The collection of examples used to teach an AI" },
        { term: "Label", definition: "The correct answer attached to each example" },
        { term: "Training", definition: "The process of the AI learning patterns from data" },
        { term: "Accuracy", definition: "The percentage of predictions the AI gets right" },
        { term: "Retraining", definition: "Teaching the AI again with better data to improve it" },
        { term: "Overfitting", definition: "When the AI memorizes instead of learning patterns" },
      ],
    },
  },
  "machine-learning-5": {
    type: "challenge",
    challenge: {
      prompt: "An AI was trained to recognize faces, but it only saw photos of light-skinned people. Now it can't recognize darker skin tones. Describe what went wrong and how you would fix it.",
      hints: [
        "The problem is in the training data, not the AI code itself.",
        "What kind of data would make the AI fair to everyone?",
        "Think about who should be involved in checking the AI's accuracy.",
      ],
      reflection: "Bias in AI comes from biased data. As an AI builder, you have the power to make AI fair for everyone.",
    },
  },

  // ===== NEURAL NETWORKS =====
  "neural-networks-1": {
    type: "story",
    story: {
      intro: "You climb into the Neural Peaks, where glowing bridges connect nodes that pulse with energy. A guide made of light appears beside you.",
      chapters: [
        { emoji: "\u{1F9A0}", text: "'Welcome to the peaks,' the guide says, their body shimmering. 'Here, you'll learn about neurons — the tiny building blocks of every neural network.'" },
        { emoji: "\u{1F4A1}", text: "'A neuron is simple,' the guide explains. 'It takes in numbers, does a little math, and sends out a signal. Like a light switch that's not just on or off — it can be a little bit on.'" },
        { emoji: "\u{1F50C}", text: "'But here's the magic: when you connect thousands of neurons together, they can learn ANY pattern. That's how your brain works too! Your brain has 86 billion neurons.'" },
        { emoji: "\u{1F31F}", text: "'An artificial neural network might have a few hundred or a few million. But the principle is the same: many simple units, connected together, creating something that can learn.'" },
      ],
      reflection: "Your brain has 86 billion neurons. An AI might have millions. Which do you think is smarter, and why?",
    },
  },
  "neural-networks-2": {
    type: "interactive",
    interactive: {
      activity: "match",
      intro: "Match each neural network term to what it does. These are the parts that make a neural network learn!",
      pairs: [
        { term: "Input layer", definition: "Where data enters the network (like eyes seeing an image)" },
        { term: "Hidden layers", definition: "Where the network finds patterns (like thinking)" },
        { term: "Output layer", definition: "Where the answer comes out (like saying 'cat!')" },
        { term: "Weights", definition: "How strong each connection is (adjusted during learning)" },
        { term: "Activation", definition: "Whether a neuron 'fires' based on its input" },
        { term: "Backpropagation", definition: "The algorithm that adjusts weights to fix mistakes" },
      ],
    },
  },
  "neural-networks-3": {
    type: "mini-game",
    miniGame: {
      gameId: "neural-builder",
      intro: "Head to the Arcade and play 'Neural Network Builder'. Connect virtual neurons and watch information flow through the layers. Come back when you've built a network!",
    },
  },
  "neural-networks-4": {
    type: "story",
    story: {
      intro: "The guide leads you to the highest peak, where you can see the entire network spread out below like a glowing city.",
      chapters: [
        { emoji: "\u{1F3D9}\u{FE0F}", text: "'Look down there,' the guide says. 'See how the neurons are arranged in layers? Each layer learns something a little more complex than the last.'" },
        { emoji: "\u{1F4D7}", text: "'The first layer might just see edges. The next layer combines edges into shapes. The next sees objects. By the end, the network recognizes a whole face!'" },
        { emoji: "\u{1F9E0}", text: "'That's why we call it DEEP learning,' the guide continues. 'Deep just means lots of layers. More layers = deeper understanding. But also harder to train.'" },
        { emoji: "\u26A1", text: "'The future of AI is figuring out how to build networks that are both deep AND fast. Maybe you'll be the one to discover the next breakthrough!'" },
      ],
      reflection: "Why do you think more layers might help an AI understand things better? Can you think of a time when breaking a problem into steps helped you understand it?",
    },
  },

  // ===== COMPUTER VISION =====
  "computer-vision-1": {
    type: "story",
    story: {
      intro: "Heat rises from the Vision Volcano. The air shimmers with pixels. A creature with a single enormous eye floats on the thermals.",
      chapters: [
        { emoji: "\u{1F441}\u{FE0F}", text: "The eye-creature blinks. 'You humans see images as pictures. But computers? They see NUMBERS. Millions of numbers, one for each tiny dot of color.'" },
        { emoji: "\u{1F7E9}", text: "'Each dot is called a pixel. A single photo might have 12 million pixels. Each pixel is three numbers: how much red, green, and blue it has.'" },
        { emoji: "\u{1F9E9}", text: "'So how does AI recognize a cat in all those numbers? It looks for PATTERNS. Curves, edges, textures, shapes — the same features your brain uses, but in math!'" },
        { emoji: "\u{1F44D}", text: "'The AI trains on millions of cat and non-cat images until it learns which number-patterns mean cat. Pretty amazing for a bunch of math, right?'" },
      ],
      reflection: "If a computer sees images as numbers, how do you think it tells the difference between a cat and a dog?",
    },
  },
  "computer-vision-2": {
    type: "mini-game",
    miniGame: {
      gameId: "train-robot",
      intro: "Play 'Train a Robot' in the Arcade! This time, focus on how the AI's accuracy changes as you add more labeled images. That's computer vision in action!",
    },
  },
  "computer-vision-3": {
    type: "interactive",
    interactive: {
      activity: "sort",
      intro: "Sort each task into what kind of computer vision it uses. Think about whether the AI needs to identify WHAT something is, or WHERE it is!",
      categories: ["Classification (what is it?)", "Detection (where is it?)"],
      items: [
        { emoji: "\u{1F415}", label: "Is this a cat or a dog?", category: "Classification (what is it?)" },
        { emoji: "\u{1F4CD}", label: "Draw a box around every car in this photo", category: "Detection (where is it?)" },
        { emoji: "\u{1F34F}", label: "Is this fruit ripe or unripe?", category: "Classification (what is it?)" },
        { emoji: "\u{1F697}", label: "Find every pedestrian on this street for a self-driving car", category: "Detection (where is it?)" },
        { emoji: "\u{1F614}", label: "Is this face happy or sad?", category: "Classification (what is it?)" },
        { emoji: "\u{1F451}", label: "Find all the license plates in this parking lot", category: "Detection (where is it?)" },
      ],
    },
  },
  "computer-vision-4": {
    type: "challenge",
    challenge: {
      prompt: "Design an AI system that helps a self-driving car 'see'. What would it need to detect? What could go wrong? How would you make it safe?",
      hints: [
        "Think about everything a driver needs to see: cars, people, signs, traffic lights, road markings...",
        "What happens if the camera is foggy, or it's raining, or the sun is in its eyes?",
        "Safety is the most important thing. What's your backup plan if the AI isn't sure?",
      ],
      reflection: "Self-driving cars are one of the hardest AI problems in the world. You're thinking like a real AI safety engineer!",
    },
  },

  // ===== NLP =====
  "nlp-1": {
    type: "story",
    story: {
      intro: "At the Language Lagoon, words float on the surface like lily pads. A fish made of letters swims up and speaks in riddles.",
      chapters: [
        { emoji: "\u{1F4AC}", text: "'You read words,' the fish says, bubbling letters. 'But computers? They need numbers. So we chop words into pieces called TOKENS.'" },
        { emoji: "\u{1F9E9}", text: "'A token might be a whole word like \"cat\". Or it might be part of a word like \"play\" and \"ing\". Each token gets a number. The word \"playing\" might be token 456 + token 789.'" },
        { emoji: "\u{1F4DA}", text: "'Why tokens and not just whole words? Because there are too many words! But a few thousand tokens can build millions of combinations. It's like how 26 letters make every English word.'" },
        { emoji: "\u{1F31F}", text: "'Once words are tokens, the AI can learn which tokens tend to appear together. That's how it knows \"The cat sat on the ___\" is probably \"mat\", not \"helicopter\"!'" },
      ],
      reflection: "If you split 'unhappiness' into tokens, how would you do it? What pieces would you use?",
    },
  },
  "nlp-2": {
    type: "mini-game",
    miniGame: {
      gameId: "data-detective",
      intro: "Play 'Data Detective' in the Arcade! This time, think about how the AI uses TEXT data to learn. Every good or bad data example applies to text too!",
    },
  },
  "nlp-3": {
    type: "interactive",
    interactive: {
      activity: "sort",
      intro: "Sort each message into 'Positive' or 'Negative' sentiment. This is what sentiment analysis AI does — it reads text and figures out the emotion behind it!",
      categories: ["Positive", "Negative"],
      items: [
        { emoji: "\u{1F60A}", label: "I love this game so much!", category: "Positive" },
        { emoji: "\u{1F620}", label: "This is the worst day ever.", category: "Negative" },
        { emoji: "\u{1F604}", label: "Thank you, you're the best!", category: "Positive" },
        { emoji: "\u{1F614}", label: "I'm so disappointed in the results.", category: "Negative" },
        { emoji: "\u{1F389}", label: "We won the championship!", category: "Positive" },
        { emoji: "\u{1F61F}", label: "I don't think I can do this anymore.", category: "Negative" },
      ],
    },
  },
  "nlp-4": {
    type: "challenge",
    challenge: {
      prompt: "Write a prompt for an AI that will help you with homework — without giving you the answers. Think about what instructions would make the AI a good tutor.",
      hints: [
        "Start with a role: 'You are a friendly tutor who...'",
        "Tell the AI what NOT to do: 'Never give me the answer directly.'",
        "Tell the AI what TO do: 'Guide me step by step with hints.'",
      ],
      reflection: "The way you talk to AI changes everything it does. You just wrote a system prompt — the same technique used by professional AI builders!",
    },
  },

  // ===== PROMPT ENGINEERING =====
  "prompt-engineering-1": {
    type: "story",
    story: {
      intro: "On Prompt Planet, the ground shifts with every word you speak. A wizard in a robe of glowing text floats down to greet you.",
      chapters: [
        { emoji: "\u{1F9D9}", text: "'Welcome, young prompt engineer,' the wizard says, robes shimmering with words. 'Here, words have power. The way you ASK determines what you GET.'" },
        { emoji: "\u274C}", text: "The wizard waves a hand. A prompt appears: 'write story.' A boring, two-sentence story appears. 'See? Vague prompt, vague result.'" },
        { emoji: "\u2705", text: "The wizard waves again: 'Write a 5-sentence bedtime story about a brave robot who helps a lost child, in a gentle and warm tone.' A beautiful story appears, full of heart." },
        { emoji: "\u{1F31F}", text: "'THAT is prompt engineering,' the wizard says. 'Specificity, context, format, tone — these are your tools. The better you describe what you want, the more magic you create.'" },
      ],
      reflection: "Think of a time you asked someone for something and got the wrong result. How could you have asked differently?",
    },
  },
  "prompt-engineering-2": {
    type: "mini-game",
    miniGame: {
      gameId: "prompt-wizard",
      intro: "Play 'Prompt Wizard' in the Arcade! Compare two prompts and pick the one that produces the better result. Learn the principles that make prompts powerful!",
    },
  },
  "prompt-engineering-3": {
    type: "interactive",
    interactive: {
      activity: "match",
      intro: "Match each prompt technique to its description. These are the tools professional prompt engineers use every day!",
      pairs: [
        { term: "Specificity", definition: "Give details: format, length, tone, and subject" },
        { term: "Role prompting", definition: "Tell the AI who to be ('You are a science teacher...')" },
        { term: "Few-shot", definition: "Give examples of what you want before asking" },
        { term: "Chain of thought", definition: "Ask the AI to think step by step" },
        { term: "Constraints", definition: "Tell the AI what NOT to do or include" },
        { term: "Format", definition: "Specify the output structure (list, table, JSON)" },
      ],
    },
  },
  "prompt-engineering-4": {
    type: "challenge",
    challenge: {
      prompt: "Write a prompt that makes an AI generate a structured JSON object describing a made-up animal. Include the animal's name, habitat, diet, and a fun fact. Test it in the Creator lab above!",
      hints: [
        "Start by telling the AI the exact format you want.",
        "Give an example of the JSON structure.",
        "Specify the fields: name, habitat, diet, fun_fact.",
      ],
      reflection: "Structured outputs are how AI is used in real software. Every app that uses AI generates structured data just like this!",
    },
  },

  // ===== ETHICS =====
  "ethics-1": {
    type: "story",
    story: {
      intro: "In a quiet corner of Somora, a scale of justice glows softly. A wise owl perches on top, watching you with knowing eyes.",
      chapters: [
        { emoji: "\u2696\u{FE0F}", text: "'Fairness,' the owl says, 'is the hardest problem in AI. Not because it's technically difficult, but because fairness itself is hard to define.'" },
        { emoji: "\u{1F9D0}", text: "'Imagine an AI that decides who gets a loan. If it was trained on data from a time when certain people were denied loans unfairly, the AI will learn to deny them too. It repeats the past.'" },
        { emoji: "\u{1F6A7}", text: "'The AI isn't being malicious. It's just learning patterns. But if the patterns are unfair, the AI's decisions will be unfair too. Garbage in, unfairness out.'" },
        { emoji: "\u{1F4A1}", text: "'The fix? Diverse teams, diverse data, and constant checking. AI builders have a responsibility to test their AI on everyone, not just people like themselves.'" },
      ],
      reflection: "If you built an AI that helped with hiring, how would you make sure it doesn't discriminate?",
    },
  },
  "ethics-2": {
    type: "mini-game",
    miniGame: {
      gameId: "data-detective",
      intro: "Play 'Data Detective' in the Arcade! This time, think about how biased data leads to biased AI. Every example of bad data could be hiding unfairness.",
    },
  },
  "ethics-3": {
    type: "interactive",
    interactive: {
      activity: "sort",
      intro: "Sort each AI statement into 'True fact' or 'Hallucination (made up)'. AI can sound confident even when it's wrong — can you tell the difference?",
      categories: ["True fact", "Hallucination (made up)"],
      items: [
        { emoji: "\u{1F4D9}", label: "The Great Wall of China is visible from space", category: "Hallucination (made up)" },
        { emoji: "\u{1F30D}", label: "The Earth orbits the Sun", category: "True fact" },
        { emoji: "\u{1F4DC}", label: "In 1492, Columbus sailed to the Americas", category: "True fact" },
        { emoji: "\u{1F416}", label: "Abraham Lincoln was born in 1950", category: "Hallucination (made up)" },
        { emoji: "\u{1F341}", label: "Trees produce oxygen through photosynthesis", category: "True fact" },
        { emoji: "\u{1F4AB}", label: "The Eiffel Tower was built by aliens", category: "Hallucination (made up)" },
      ],
    },
  },
  "ethics-4": {
    type: "challenge",
    challenge: {
      prompt: "You're building an AI that recommends videos to kids. What rules would you put in place to make it safe, fair, and responsible? List at least 3 rules.",
      hints: [
        "Think about what content should NEVER be recommended to children.",
        "How do you make sure the AI doesn't create an echo chamber?",
        "Who should be able to override the AI's decisions?",
      ],
      reflection: "Responsible AI isn't an afterthought — it's designed from the start. You're thinking like an AI ethics leader!",
    },
  },

  // ===== GENERATIVE AI =====
  "generative-ai-1": {
    type: "story",
    story: {
      intro: "At the edge of the known worlds, an art studio floats in a nebula. Paintings create themselves on the walls. A brush hovers in mid-air, waiting for you.",
      chapters: [
        { emoji: "\u{1F3A8}", text: "'Generative AI,' a voice whispers from the canvas, 'doesn't just recognize things. It CREATES them. Images, stories, music, code — all from patterns it learned.'" },
        { emoji: "\u{1F9F1}", text: "'How? Imagine you showed the AI a million paintings. It learned what colors go together, what shapes look nice, what compositions feel balanced. Now it can paint NEW ones that follow those rules.'" },
        { emoji: "\u2728", text: "'But it's not copying! It's creating something new from the patterns it learned. Like how you learned to draw by practicing, and now your art is uniquely yours.'" },
        { emoji: "\u{1F4A1}", text: "'The magic is in the prompt. Describe what you want in detail, and the AI brings it to life. Your imagination is the only limit!'" },
      ],
      reflection: "If you could ask an AI to create any image, what would you describe? Try it in the Creator lab!",
    },
  },
  "generative-ai-2": {
    type: "mini-game",
    miniGame: {
      gameId: "prompt-wizard",
      intro: "Play 'Prompt Wizard' in the Arcade! The same principles that make good text prompts also make good image prompts. Specificity is everything!",
    },
  },
  "generative-ai-3": {
    type: "interactive",
    interactive: {
      activity: "sort",
      intro: "Sort each use of generative AI into 'Creative use' or 'Responsible concern'. Generative AI is powerful — but with power comes responsibility!",
      categories: ["Creative use", "Responsible concern"],
      items: [
        { emoji: "\u{1F4D6}", label: "Generating a bedtime story for your little sister", category: "Creative use" },
        { emoji: "\u{1F575}\u{FE0F}", label: "Making a fake video of a real person saying something they didn't", category: "Responsible concern" },
        { emoji: "\u{1F3A8}", label: "Creating art for your school project", category: "Creative use" },
        { emoji: "\u{1F4DD}", label: "Copying someone's homework using AI", category: "Responsible concern" },
        { emoji: "\u{1F3B5}", label: "Making music for a game you built", category: "Creative use" },
        { emoji: "\u{1F575}\u{FE0F}", label: "Pretending AI work is your own original art", category: "Responsible concern" },
      ],
    },
  },
  "generative-ai-4": {
    type: "challenge",
    challenge: {
      prompt: "Design a set of rules for using generative AI responsibly. What should people always do when they use AI to create something? What should they never do?",
      hints: [
        "Think about honesty: should you tell people when you used AI?",
        "Think about permission: can you use someone else's work to train AI without asking?",
        "Think about impact: could your AI creation hurt someone?",
      ],
      reflection: "Every great creator has a code of ethics. You're building yours right now — and that's what makes a responsible AI builder.",
    },
  },
};

export function getLessonContent(lessonId: string): LessonContent | null {
  return lessonContents[lessonId] ?? null;
}
