# r/yrdsl moderation config

Versioned source of truth for the `r/yrdsl` subreddit's sidebar,
rules, AutoModerator config, and post flairs. Reddit's API for
syncing this stuff would require a Devvit detour or an API access
exception, neither of which is worth the friction at our volume.
So: edit the files here, paste them into Reddit's mod UI when you
want changes to go live. Five minutes.

## What's where

| File | Where it goes in Reddit |
|---|---|
| [`sidebar.md`](./sidebar.md) | Mod Tools → Community settings → About → **Description** (markdown) |
| [`rules.md`](./rules.md) | Mod Tools → Rules and removal reasons → **Add rule** (one per ##-section) |
| [`AutoModerator.yml`](./AutoModerator.yml) | Mod Tools → AutoModerator → **Edit config** (paste whole file) |
| [`flairs.md`](./flairs.md) | Mod Tools → Post flair → **Add flair** (one per row in the table) |

## How to apply changes

1. Edit the relevant file in this repo.
2. Open the corresponding Reddit page (links above).
3. Paste the new contents.
4. Click save. Reddit will surface validation errors immediately if
   the AutoMod YAML has a typo.
5. Commit + push the file change so the repo stays the source of truth.

That's it — no automation, no creds, no API access form.

## When automation would be worth it

If we ever:

- Tweak AutoMod rules weekly enough that copy-paste becomes annoying
- Want PR review on rule changes
- Add scheduled posts (e.g. a weekly questions thread)

…then it's time to build a sync script that uses Reddit's classic
OAuth API (script-type app at `reddit.com/prefs/apps`). Until then,
this manual flow is strictly faster.
