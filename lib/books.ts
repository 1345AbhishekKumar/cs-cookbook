/**
 * The books shelf.
 *
 * To add a book, append one object to `books` below — the shelf on
 * /docs/books groups and counts them by `category` automatically.
 */
export const BOOK_CATEGORIES = [
  'Software Craft',
  'Architecture & Design',
  'Algorithms',
  'Data & Systems',
  'AI & Machine Learning',
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface Book {
  title: string;
  author: string;
  category: BookCategory;
  year?: number;
  note: string;
}

export const books: Book[] = [
  // ── Software Craft ────────────────────────────────────────────────────────
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Software Craft',
    year: 2008,
    note: 'Naming, functions, and formatting rules that make code readable before it tries to be clever.',
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt & David Thomas',
    category: 'Software Craft',
    year: 1999,
    note: 'Timeless habits — DRY, tracer bullets, and taking ownership of your craft.',
  },
  {
    title: 'A Philosophy of Software Design',
    author: 'John Ousterhout',
    category: 'Software Craft',
    year: 2018,
    note: 'Deep modules, information hiding, and why comments are part of the design.',
  },
  {
    title: 'Code Complete',
    author: 'Steve McConnell',
    category: 'Software Craft',
    year: 2004,
    note: 'The construction-phase reference: from variable names to defensive programming.',
  },
  {
    title: 'Refactoring',
    author: 'Martin Fowler',
    category: 'Software Craft',
    year: 2018,
    note: 'A catalog of small, safe, mechanical transformations that keep code healthy.',
  },
  {
    title: 'Working Effectively with Legacy Code',
    author: 'Michael Feathers',
    category: 'Software Craft',
    year: 2004,
    note: 'How to get untested code under test before you dare change it.',
  },

  // ── Architecture & Design ────────────────────────────────────────────────
  {
    title: 'Clean Architecture',
    author: 'Robert C. Martin',
    category: 'Architecture & Design',
    year: 2017,
    note: 'Dependency rules and boundaries that keep business logic framework-free.',
  },
  {
    title: 'Domain-Driven Design',
    author: 'Eric Evans',
    category: 'Architecture & Design',
    year: 2003,
    note: 'Ubiquitous language, bounded contexts, and modelling the business itself.',
  },
  {
    title: 'Patterns of Enterprise Application Architecture',
    author: 'Martin Fowler',
    category: 'Architecture & Design',
    year: 2002,
    note: 'The pattern vocabulary behind ORMs, MVC, and service layers.',
  },
  {
    title: 'Release It!',
    author: 'Michael T. Nygard',
    category: 'Architecture & Design',
    year: 2018,
    note: 'Stability patterns for production: circuit breakers, bulkheads, and timeouts.',
  },

  // ── Algorithms ───────────────────────────────────────────────────────────
  {
    title: 'Algorithms, 4th Edition',
    author: 'Robert Sedgewick & Kevin Wayne',
    category: 'Algorithms',
    year: 2011,
    note: 'Sorting, searching, graphs, and strings — with real, readable implementations.',
  },
  {
    title: 'Grokking Algorithms',
    author: 'Aditya Bhargava',
    category: 'Algorithms',
    year: 2016,
    note: 'The friendliest possible on-ramp to Big-O, graphs, and dynamic programming.',
  },

  // ── Data & Systems ───────────────────────────────────────────────────────
  {
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    category: 'Data & Systems',
    year: 2017,
    note: 'The definitive map of replication, partitioning, transactions, and consistency.',
  },
  {
    title: 'System Design Interview, Vol. 2',
    author: 'Alex Xu',
    category: 'Data & Systems',
    year: 2022,
    note: 'Worked designs for rate limiters, chat systems, and distributed storage.',
  },

  // ── AI & Machine Learning ────────────────────────────────────────────────
  {
    title: 'AI Engineering',
    author: 'Chip Huyen',
    category: 'AI & Machine Learning',
    year: 2025,
    note: 'Building real applications on foundation models: evals, RAG, and agents.',
  },
  {
    title: 'Designing Machine Learning Systems',
    author: 'Chip Huyen',
    category: 'AI & Machine Learning',
    year: 2022,
    note: 'The full lifecycle, from data collection to production monitoring.',
  },
  {
    title: 'Hands-On Large Language Models',
    author: 'Jay Alammar & Maarten Grootendorst',
    category: 'AI & Machine Learning',
    year: 2024,
    note: 'Transformers, embeddings, and fine-tuning, all with runnable code.',
  },
  {
    title: "LLM Engineer's Handbook",
    author: 'Paul Iusztin & Maxime Labonne',
    category: 'AI & Machine Learning',
    year: 2024,
    note: 'An end-to-end LLM project — fine-tuning, RAG, and deployment.',
  },
  {
    title: 'Deep Learning',
    author: 'Ian Goodfellow, Yoshua Bengio & Aaron Courville',
    category: 'AI & Machine Learning',
    year: 2016,
    note: 'The rigorous foundation: backpropagation, regularisation, and architectures.',
  },
  {
    title: 'Hands-On Generative AI with Transformers and Diffusion Models',
    author: 'Omar Sanseviero et al.',
    category: 'AI & Machine Learning',
    year: 2024,
    note: 'Practical generative pipelines built on the Hugging Face ecosystem.',
  },
  {
    title: 'Practical MLOps',
    author: 'Noah Gift & Alfredo Deza',
    category: 'AI & Machine Learning',
    year: 2021,
    note: 'Operationalising models: CI/CD, monitoring, and automation.',
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    category: 'AI & Machine Learning',
    year: 2020,
    note: 'The classic survey of search, logic, planning, and learning.',
  },
];
