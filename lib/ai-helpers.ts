// AI-powered writing assistance utilities
// Note: These are placeholder functions that would integrate with AI services like OpenAI

export async function generateTitleSuggestions(content: string): Promise<string[]> {
  // In production, this would call an AI API
  // For now, return sample suggestions based on content length
  
  const suggestions = [
    'The Ultimate Guide to ' + content.substring(0, 30),
    'How to Master ' + content.substring(0, 30),
    'Everything You Need to Know About ' + content.substring(0, 20),
    'Top 10 Tips for ' + content.substring(0, 30),
    'A Beginner\'s Guide to ' + content.substring(0, 30),
  ];

  return suggestions;
}

export async function generateExcerpt(content: string): Promise<string> {
  // Remove HTML tags
  const plainText = content.replace(/<[^>]*>/g, '');
  
  // Get first 2-3 sentences
  const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
  const excerpt = sentences.slice(0, 2).join(' ');
  
  return excerpt.substring(0, 200);
}

export async function suggestTags(title: string, content: string): Promise<string[]> {
  // In production, this would use NLP/AI to extract relevant tags
  // For now, extract potential keywords
  
  const text = (title + ' ' + content).toLowerCase();
  const commonWords = [
    'the',
    'is',
    'at',
    'which',
    'on',
    'a',
    'an',
    'and',
    'or',
    'but',
    'in',
    'with',
    'to',
    'for',
    'of',
    'as',
    'by',
  ];

  const words = text
    .split(/\s+/)
    .filter((word) => word.length > 4 && !commonWords.includes(word))
    .slice(0, 10);

  // Return unique words as potential tags
  return [...new Set(words)].slice(0, 5);
}

export async function improveContent(content: string): Promise<string> {
  // In production, this would use AI to suggest improvements
  // For now, return the same content with a note
  
  return content;
}

export async function checkGrammar(content: string): Promise<{
  errors: Array<{ text: string; suggestion: string }>;
}> {
  // In production, integrate with grammar checking APIs
  
  return { errors: [] };
}

export async function getSEOScore(
  title: string,
  content: string,
  metaDescription: string
): Promise<{
  score: number;
  suggestions: string[];
}> {
  const suggestions: string[] = [];
  let score = 100;

  // Title length check
  if (title.length < 30 || title.length > 60) {
    suggestions.push('Title should be between 30-60 characters');
    score -= 10;
  }

  // Meta description check
  if (!metaDescription) {
    suggestions.push('Add a meta description');
    score -= 15;
  } else if (metaDescription.length < 120 || metaDescription.length > 160) {
    suggestions.push('Meta description should be 120-160 characters');
    score -= 10;
  }

  // Content length check
  const wordCount = content.split(/\s+/).length;
  if (wordCount < 300) {
    suggestions.push('Content should be at least 300 words for better SEO');
    score -= 15;
  }

  // Headings check
  const hasHeadings = /<h[1-6]>/i.test(content);
  if (!hasHeadings) {
    suggestions.push('Add headings (H1, H2, H3) to structure your content');
    score -= 10;
  }

  // Images check
  const hasImages = /<img/i.test(content);
  if (!hasImages) {
    suggestions.push('Add relevant images to enhance your content');
    score -= 10;
  }

  return { score: Math.max(0, score), suggestions };
}

export async function getReadabilityScore(content: string): Promise<{
  score: number;
  level: string;
  suggestions: string[];
}> {
  const plainText = content.replace(/<[^>]*>/g, '');
  const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
  const words = plainText.split(/\s+/);
  const avgWordsPerSentence = words.length / (sentences.length || 1);

  let level = 'Easy';
  let score = 80;
  const suggestions: string[] = [];

  if (avgWordsPerSentence > 20) {
    level = 'Difficult';
    score = 40;
    suggestions.push('Try using shorter sentences for better readability');
  } else if (avgWordsPerSentence > 15) {
    level = 'Medium';
    score = 60;
    suggestions.push('Consider breaking down some complex sentences');
  }

  return { score, level, suggestions };
}

