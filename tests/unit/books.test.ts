import { describe, it, expect } from "vitest";
import { books, BOOK_CATEGORIES, type BookCategory } from "@/lib/books";

describe("lib/books", () => {
  it("should export a non-empty list of books", () => {
    expect(Array.isArray(books)).toBe(true);
    expect(books.length).toBeGreaterThan(0);
  });

  it("should export a non-empty list of book categories", () => {
    expect(Array.isArray(BOOK_CATEGORIES)).toBe(true);
    expect(BOOK_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("every book should have required fields", () => {
    for (const book of books) {
      expect(typeof book.title).toBe("string");
      expect(book.title.length).toBeGreaterThan(0);

      expect(typeof book.author).toBe("string");
      expect(book.author.length).toBeGreaterThan(0);

      expect(typeof book.category).toBe("string");
      expect(book.category.length).toBeGreaterThan(0);

      expect(typeof book.note).toBe("string");
      expect(book.note.length).toBeGreaterThan(0);
    }
  });

  it("every book category should be one of the defined BOOK_CATEGORIES", () => {
    const validCategories: readonly string[] = BOOK_CATEGORIES;
    for (const book of books) {
      expect(validCategories).toContain(book.category);
    }
  });

  it("every book with a year should have a reasonable year value", () => {
    for (const book of books) {
      if (book.year !== undefined) {
        expect(typeof book.year).toBe("number");
        expect(book.year).toBeGreaterThanOrEqual(1900);
        expect(book.year).toBeLessThanOrEqual(2030);
      }
    }
  });

  it("should have no duplicate book titles", () => {
    const titles = books.map((b) => b.title);
    const unique = new Set(titles);
    expect(unique.size).toBe(titles.length);
  });

  it("every BOOK_CATEGORIES entry should have at least one book", () => {
    for (const category of BOOK_CATEGORIES) {
      const booksInCategory = books.filter((b) => b.category === category);
      expect(booksInCategory.length).toBeGreaterThan(0);
    }
  });

  it("sum of books across all categories equals total books length", () => {
    const totalCount = BOOK_CATEGORIES.reduce((acc, cat) => {
      return acc + books.filter((b) => b.category === cat).length;
    }, 0);
    expect(totalCount).toBe(books.length);
  });

  it("every book note is sufficiently descriptive", () => {
    for (const book of books) {
      expect(book.note.trim().length).toBeGreaterThanOrEqual(15);
      expect(book.title.trim()).toBe(book.title);
      expect(book.author.trim()).toBe(book.author);
    }
  });

  it("every year is an integer when defined", () => {
    for (const book of books) {
      if (book.year !== undefined) {
        expect(Number.isInteger(book.year)).toBe(true);
      }
    }
  });
});
