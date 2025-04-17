/**
 * Table of Contents Processor
 *
 * This utility processes and extracts table of contents from uploaded books.
 * It supports different formats and structures commonly found in books.
 */

export interface TocEntry {
  id: string;
  title: string;
  level: number;
  pageNumber?: number;
  children?: TocEntry[];
}

export interface ProcessedToc {
  entries: TocEntry[];
  flatEntries: TocEntry[];
}

/**
 * Process raw table of contents text into structured format
 *
 * @param tocText - Raw text of table of contents
 * @returns Processed table of contents with hierarchical and flat structures
 */
export const processTocText = (tocText: string): ProcessedToc => {
  // Split the text into lines and remove empty lines
  const lines = tocText
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const entries: TocEntry[] = [];
  const flatEntries: TocEntry[] = [];

  // Process each line to extract title, level, and page number
  lines.forEach((line, index) => {
    // Try to extract page number if it exists at the end of the line
    const pageMatch = line.match(/\s*(\d+)\s*$/);
    const pageNumber = pageMatch ? parseInt(pageMatch[1], 10) : undefined;

    // Remove page number from the line
    let title = pageMatch ? line.substring(0, pageMatch.index).trim() : line;

    // Determine the level based on indentation or markers
    let level = 1; // Default level

    // Check for common chapter indicators
    if (title.match(/^chapter\s+\d+/i)) {
      level = 1;
    }
    // Check for indentation (each 2 spaces = 1 level)
    else {
      const leadingSpaces = line.length - line.trimStart().length;
      level = Math.floor(leadingSpaces / 2) + 1;
      title = title.trimStart();
    }

    // Check for section numbering (e.g., "1.2.3 Title")
    const sectionMatch = title.match(/^(\d+(\.\d+)*)/);
    if (sectionMatch) {
      // Count the number of dots to determine level
      const dots = (sectionMatch[1].match(/\./g) || []).length;
      level = dots + 1;
      title = title.trim();
    }

    const entry: TocEntry = {
      id: `toc-${index}`,
      title,
      level,
      pageNumber,
    };

    flatEntries.push(entry);

    // Build hierarchical structure
    if (level === 1 || entries.length === 0) {
      entries.push(entry);
    } else {
      // Find the appropriate parent
      let currentEntries = entries;
      let currentLevel = 1;

      while (currentLevel < level) {
        const lastEntry = currentEntries[currentEntries.length - 1];
        if (!lastEntry.children) {
          lastEntry.children = [];
        }
        currentEntries = lastEntry.children;
        currentLevel++;
      }

      currentEntries.push(entry);
    }
  });

  return { entries, flatEntries };
};

/**
 * Extract table of contents from PDF content
 * This is a placeholder for actual PDF parsing logic
 *
 * @param pdfContent - Binary or text content from PDF
 * @returns Processed table of contents
 */
export const extractTocFromPdf = (
  pdfContent: ArrayBuffer,
): Promise<ProcessedToc> => {
  // In a real implementation, this would use a PDF parsing library
  // For now, we'll return a mock TOC
  return Promise.resolve({
    entries: [
      {
        id: "toc-1",
        title: "Chapter 1: Introduction",
        level: 1,
        pageNumber: 1,
        children: [
          { id: "toc-2", title: "Section 1.1", level: 2, pageNumber: 2 },
          { id: "toc-3", title: "Section 1.2", level: 2, pageNumber: 5 },
        ],
      },
      {
        id: "toc-4",
        title: "Chapter 2: Methodology",
        level: 1,
        pageNumber: 10,
      },
    ],
    flatEntries: [
      {
        id: "toc-1",
        title: "Chapter 1: Introduction",
        level: 1,
        pageNumber: 1,
      },
      { id: "toc-2", title: "Section 1.1", level: 2, pageNumber: 2 },
      { id: "toc-3", title: "Section 1.2", level: 2, pageNumber: 5 },
      {
        id: "toc-4",
        title: "Chapter 2: Methodology",
        level: 1,
        pageNumber: 10,
      },
    ],
  });
};

/**
 * Detect if a text is likely a table of contents
 *
 * @param text - Text to analyze
 * @returns Boolean indicating if the text is likely a TOC
 */
export const isTocText = (text: string): boolean => {
  const lines = text.split("\n").filter((line) => line.trim().length > 0);
  if (lines.length < 3) return false;

  // Check for patterns common in TOCs
  let pageNumberCount = 0;
  let chapterCount = 0;

  for (const line of lines) {
    // Check for page numbers at the end of lines
    if (line.match(/\s\d+\s*$/)) {
      pageNumberCount++;
    }

    // Check for chapter indicators
    if (line.match(/chapter|section|part/i)) {
      chapterCount++;
    }
  }

  // If more than 50% of lines have page numbers or at least 2 chapter indicators, likely a TOC
  return pageNumberCount / lines.length > 0.5 || chapterCount >= 2;
};
