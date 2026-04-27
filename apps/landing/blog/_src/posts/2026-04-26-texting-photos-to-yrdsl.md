---
title: "yrdsl.app, WhatsApp, and a little server in my son's room"
date: 2026-04-26
tags: [tutorial, setup]
description: "How a photo on my phone ends up on the yard sale, without me opening a browser. And how to wire up the same setup yourself."
---

The thing I actually wanted, well before I built any of this, was simple. Walk around the house with my phone. Take a picture of the couch. Have it show up on my yard sale, with a price and a description, without opening a browser, copy-pasting anything, or logging into anything.

That was the whole goal. A workflow with so little friction that I'd actually use it, every time I noticed another thing I wanted gone.

Here's what it ended up looking like:

<video controls preload="metadata" playsinline poster="/assets/openclaw-poster.webp">
  <source src="/assets/openclaw.mp4" type="video/mp4">
</video>

I send a photo to a WhatsApp bot. It asks what to call it and how much I want for it. I type a few words back, and the listing shows up on the sale.

There are three pieces making this work, and one of them is a little Ubuntu box plugged in next to my son's gaming PC.

## The architecture

```
WhatsApp on my phone
    ↓
openclaw bot (Node.js, in podman, on a small Ubuntu server)
    ↓
yrdsl.app REST API (with my account token)
```

- **WhatsApp** carries my messages to the bot, and the bot's replies back to me.
- **openclaw** is a small Node program that uses [Baileys](https://github.com/WhiskeySockets/Baileys) to read WhatsApp messages and the Anthropic SDK to ask Claude what to do with them. Claude has a set of "tools" wired up that map 1:1 to yrdsl operations (add_item, attach_image, mark_reserved, and so on).
- **yrdsl.app** is the hosted yard sale. It exposes a plain REST API behind a bearer token, which is what openclaw actually calls.

## What you need

- A **yrdsl.app account** with at least one sale. Sign up at [app.yrdsl.app/signup](https://app.yrdsl.app/signup); it's free during the pre-release.
- An **API token** from the Connect Claude page in the SPA. Looks like `yrs_live_...`.
- An **LLM that can do tool use**. The example uses Claude via the Anthropic API ([console.anthropic.com](https://console.anthropic.com)). A local model in [Ollama](https://ollama.com) is a fine substitute if you'd rather not send anything to the cloud.
- A **server**. Mine's a refurbished mini-PC running Ubuntu 24.04 in my son's bedroom. A Raspberry Pi 4, a tiny VPS, a spare laptop. Anything that runs Linux and stays online will do.
- **podman** (or docker; same commands, just swap the binary).

## Setting it up

The full bot source lives in [yrdsl/packages/mcp/README.md](https://github.com/KuvopLLC/yrdsl/blob/main/packages/mcp/README.md#build-a-whatsapp-bot). Below is what you actually run, end to end, on the box.

### 1. Drop the source files in one directory

On the server, in your home folder:

```sh
mkdir -p ~/.openclaw && cd ~/.openclaw
```

Copy the three files from the README into here: `Containerfile`, `bot.js`, and `package.json`.

### 2. Set up the env file

Create `~/.openclaw/.env` with three required variables:

```sh
ANTHROPIC_API_KEY=sk-ant-...
YRDSL_API_TOKEN=yrs_live_...
ALLOWED_JIDS=__placeholder__@lid
```

`ALLOWED_JIDS` is a hard allowlist of WhatsApp identifiers. The bot won't reply to anyone whose ID isn't on this list, and it won't even start with the list empty. We'll fill in the real value in a minute. For now, leave the placeholder.

### 3. Build the image

```sh
podman build -t localhost/openclaw:latest -f Containerfile .
```

First build pulls Node 22 and installs Baileys plus the Anthropic SDK. Takes a minute.

### 4. Start it once and grab the QR code

```sh
podman run -d --name openclaw \
  --env-file ~/.openclaw/.env \
  -v ~/.openclaw/whatsapp-auth:/app/whatsapp-auth:Z \
  -v ~/.openclaw/images:/app/images:Z \
  --replace localhost/openclaw:latest

podman logs -f openclaw
```

The logs will print a QR code in ASCII. Open WhatsApp on your phone, go to Settings, then Linked Devices, then Link a Device, and scan it. You should see `[whatsapp] Connected` in the logs.

### 5. Find your WhatsApp ID

Send any message to the bot from your phone. The logs will print:

```
[skip] not in allowlist: 209126403625097@lid
```

That long number ending in `@lid` is your ID. Modern WhatsApp uses these opaque "Linked IDs" instead of phone numbers, so even though I know my own phone number perfectly well, the bot sees a 15-digit string ending in `@lid`.

Copy your ID, edit `.env`, replace the placeholder:

```sh
ALLOWED_JIDS=209126403625097@lid
```

Then restart:

```sh
podman restart openclaw
```

Send another message. This time the bot replies.

### 6. Send the couch

Take a photo of whatever you want to sell. Send it to the openclaw chat. The bot asks you for a title and price if you don't include them in the caption. Then it adds the item to your sale and sends back a public link. Open it in a browser and your couch is for sale.

## Why I keep using it

The friction is gone, which is what I wanted. Walking around the house with my phone, the photos go up before I put the phone back in my pocket, which is enough to mean I actually do it. That's the test for any side-project I build: whether I keep using it. With this one, I do.
