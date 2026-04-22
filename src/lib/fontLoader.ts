export interface GoogleFont {
  name: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace';
}

export const GOOGLE_FONTS: GoogleFont[] = [
  { name: 'Roboto', category: 'sans-serif' },
  { name: 'Open Sans', category: 'sans-serif' },
  { name: 'Lato', category: 'sans-serif' },
  { name: 'Montserrat', category: 'sans-serif' },
  { name: 'Poppins', category: 'sans-serif' },
  { name: 'Nunito', category: 'sans-serif' },
  { name: 'Raleway', category: 'sans-serif' },
  { name: 'Oswald', category: 'display' },
  { name: 'Merriweather', category: 'serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'EB Garamond', category: 'serif' },
  { name: 'Libre Baskerville', category: 'serif' },
  { name: 'Cormorant Garamond', category: 'serif' },
  { name: 'Cinzel', category: 'serif' },
  { name: 'Spectral', category: 'serif' },
  { name: 'PT Serif', category: 'serif' },
  { name: 'Arvo', category: 'serif' },
  { name: 'Bitter', category: 'serif' },
  { name: 'Zilla Slab', category: 'serif' },
  { name: 'Source Sans 3', category: 'sans-serif' },
  { name: 'Cabin', category: 'sans-serif' },
  { name: 'Titillium Web', category: 'sans-serif' },
  { name: 'Exo 2', category: 'sans-serif' },
  { name: 'Quicksand', category: 'sans-serif' },
  { name: 'Josefin Sans', category: 'sans-serif' },
  { name: 'Ubuntu', category: 'sans-serif' },
  { name: 'Dancing Script', category: 'handwriting' },
  { name: 'Great Vibes', category: 'handwriting' },
  { name: 'Pacifico', category: 'handwriting' },
  { name: 'Lobster', category: 'display' },
];

const loadedFonts = new Set<string>();

/**
 * Fetch the actual woff2 URL from Google Fonts CSS API,
 * then load via FontFace API for canvas rendering.
 */
export async function loadFont(fontName: string): Promise<void> {
  if (loadedFonts.has(fontName)) return;

  try {
    const familyParam = fontName.replace(/ /g, '+');
    const cssUrl = `https://fonts.googleapis.com/css2?family=${familyParam}:ital,wght@0,400;0,700;1,400;1,700&display=swap`;

    const response = await fetch(cssUrl, {
      headers: {
        // Request woff2 format
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    const cssText = await response.text();

    // Parse all @font-face blocks
    const fontFaceRegex = /@font-face\s*\{[^}]*\}/g;
    const matches = cssText.match(fontFaceRegex);

    if (!matches) {
      console.warn(`No @font-face found for ${fontName}`);
      return;
    }

    const promises: Promise<FontFace>[] = [];

    for (const block of matches) {
      const srcMatch = block.match(/src:\s*url\(([^)]+)\)/);
      const weightMatch = block.match(/font-weight:\s*(\d+)/);
      const styleMatch = block.match(/font-style:\s*(\w+)/);

      if (!srcMatch) continue;

      const fontUrl = srcMatch[1];
      const weight = weightMatch ? weightMatch[1] : '400';
      const style = styleMatch ? styleMatch[1] : 'normal';

      const fontFace = new FontFace(fontName, `url(${fontUrl})`, {
        weight,
        style,
        display: 'swap',
      });

      promises.push(fontFace.load());
    }

    const loadedFaces = await Promise.all(promises);
    for (const face of loadedFaces) {
      document.fonts.add(face);
    }

    loadedFonts.add(fontName);
  } catch (error) {
    console.error(`Failed to load font ${fontName}:`, error);
  }
}

/**
 * Preload font previews by injecting a Google Fonts stylesheet.
 * This is used only for the picker dropdown display.
 */
export function preloadFontPreviews(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById('google-fonts-preview')) return;

  const families = GOOGLE_FONTS.map((f) => f.name.replace(/ /g, '+')).join('&family=');
  const link = document.createElement('link');
  link.id = 'google-fonts-preview';
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${families}&display=swap`;
  document.head.appendChild(link);
}

export function isFontLoaded(fontName: string): boolean {
  return loadedFonts.has(fontName);
}
