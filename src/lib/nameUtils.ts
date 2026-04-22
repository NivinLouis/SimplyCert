export type CaseTransform = 'none' | 'uppercase' | 'lowercase' | 'titlecase' | 'sentencecase';

export function applyCaseTransform(name: string, transform: CaseTransform): string {
  switch (transform) {
    case 'uppercase':
      return name.toUpperCase();
    case 'lowercase':
      return name.toLowerCase();
    case 'titlecase':
      return name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    case 'sentencecase':
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    default:
      return name;
  }
}

export function findLongestName(names: string[]): string {
  if (names.length === 0) return '';
  return names.reduce((longest, name) => (name.length > longest.length ? name : longest), '');
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\:*?"<>|]/g, '_')
    .replace(/^[\s_]+|[\s_]+$/g, '')
    .trim() || 'certificate';
}

export function parseNames(text: string): string[] {
  const hasCommas = text.includes(',');
  const delimiter = hasCommas ? ',' : '\n';
  return text
    .split(delimiter)
    .map((name) => name.trim())
    .filter((name) => name.length > 0);
}
