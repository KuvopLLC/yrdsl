# Post flairs

Add at **Mod Tools → Post flair → Add flair**. AutoModerator references
these by exact name (see `AutoModerator.yml`), so don't rename them
without also updating the YAML.

| Flair text | Background | Text color | Auto-applied? |
|---|---|---|---|
| **Question** | purple (`#7c3aed`) | white | yes (titles ending in `?`) |
| **Bug** | red (`#dc2626`) | white | yes (titles with bug/broken/error keywords) |
| **Feature request** | blue (`#2563eb`) | white | yes (titles with feature/wishlist keywords) |
| **Show & tell** | green (`#16a34a`) | white | no — users self-flair |
| **Hosted** | gray (`#6b7280`) | white | no — users self-flair |
| **Self-hosted** | gray (`#6b7280`) | white | no — users self-flair |

Settings to enable on each:

- ✅ **Mod-only**: off (users can pick at submission)
- ✅ **Allow user edits**: off (don't let people relabel a Bug as Show & tell)
- ✅ **Type**: Text only

The Hosted / Self-hosted flairs are contextual flags people add alongside
their main flair via the `Edit flair` menu — they're not strictly enforced
by AutoMod because plenty of posts don't need them.
