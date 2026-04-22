'use client';

import { authorGithub, authorLinkedIn, authorName } from '@/lib/site';

export default function AppFooter() {
  return (
    <footer className="border-t border-border/30 py-3 text-center text-xs text-muted-foreground">
      <p>
        Built by {authorName}{' '}
        <span aria-hidden="true">·</span>{' '}
        <a
          href={authorGithub}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground hover:text-violet-600"
        >
          GitHub
        </a>{' '}
        <span aria-hidden="true">·</span>{' '}
        <a
          href={authorLinkedIn}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground hover:text-violet-600"
        >
          LinkedIn
        </a>
      </p>
    </footer>
  );
}
