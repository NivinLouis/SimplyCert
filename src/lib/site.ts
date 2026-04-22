const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = rawSiteUrl?.length
  ? rawSiteUrl.replace(/\/+$/, '')
  : 'http://localhost:3000';

export const siteName = 'SimplyCert';
export const authorName = 'Nivin P Louis';
export const authorGithub = 'https://github.com/NivinLouis';
export const authorLinkedIn = 'https://www.linkedin.com/in/nivin-louis/';
export const authorEmail = 'nivinlouis123@gmail.com';
export const authorDescription =
  'B.Tech AIML Student at Vidya Academy of Science and Technology. Vibe Coder who builds apps that make life easy.';
export const authorKeywords = [
  'Artificial Intelligence',
  'Machine Learning',
  'Web Apps',
  'React',
  'Next.js',
  'Vibe Coding',
];

export const defaultTitle =
  'SimplyCert – Batch Certificate Generator | Nivin P Louis';

export const defaultDescription =
  'SimplyCert by Nivin P Louis is a free batch certificate generator that lets you upload your own certificate design, add names from CSV, position text visually, and export personalized PDFs privately in your browser.';

export const defaultOgImage = '/hero.png';
