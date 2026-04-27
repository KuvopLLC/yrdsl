#!/usr/bin/env node
/**
 * Scaffold a new blog post markdown file with the right frontmatter and
 * filename convention.
 *
 *   node scripts/new-post.mjs "Photo uploads are now compressed" tech mcp
 *
 * Drops a file into apps/landing/blog/_src/posts/ with today's date,
 * a slugified filename, and starter frontmatter. The build script
 * picks it up automatically on next deploy.
 */

import { existsSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const POSTS_DIR = resolve(HERE, '..', 'apps', 'landing', 'blog', '_src', 'posts');

const [titleArg, ...tagArgs] = process.argv.slice(2);

if (!titleArg) {
  console.error('Usage: node scripts/new-post.mjs "Post title" [tag1] [tag2] ...');
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const slug = titleArg
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');
if (!slug) {
  console.error("Couldn't derive a slug from that title. Pick something with letters/numbers.");
  process.exit(1);
}
const filename = `${today}-${slug}.md`;
const path = join(POSTS_DIR, filename);

if (existsSync(path)) {
  console.error(`already exists: ${path}`);
  process.exit(1);
}

const tagList = tagArgs.join(', ');
const body = `---
title: ${titleArg}
date: ${today}
tags: [${tagList}]
description: TODO — one-line summary used for OG meta + post-list snippet.
---

Write the post here. Markdown, GFM tables, code blocks all work.
Drop image files alongside this .md and reference them with relative
paths if you want.
`;

writeFileSync(path, body);
console.log(`✓ created ${path}`);
console.log('  edit, then commit + push — deploy-landing rebuilds the blog automatically.');
