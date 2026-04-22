const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = rawSiteUrl?.length
  ? rawSiteUrl.replace(/\/+$/, '')
  : 'http://localhost:3000';

export const siteName = 'SimplyCert';

export const defaultTitle =
  'SimplyCert – Free Bulk Certificate Generator | Upload Your Design, Add Names from CSV';

export const defaultDescription =
  'Generate personalized e-certificates in bulk for free. Upload your own certificate design, paste a name list or upload CSV, mark the text position, and download individual PDFs. No signup. No data upload. 100% private.';

export const defaultOgImage = '/hero.png';
