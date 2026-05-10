# Wireframe — Atomek Control Tower

## Default landing tab

```text
┌──────────────────────────────────────────────────────────────────────┐
│ Mission Control                                                       │
├──────────────────────┬───────────────────────────────┬───────────────┤
│ Resources             │ Active Mission                 │ Runs / Output │
│                      │                               │               │
│ Pods                  │ Goal: [____________________]   │ ● Claude run  │
│  ✓ Hermes pod 04      │                               │   streaming…  │
│  ✓ OpenClaw pod 02    │ [Start Mission] [Open Mission]│               │
│                      │                               │ Artifacts     │
│ Local agents          │ Recommended plan               │  PATCH.diff   │
│  ✓ Claude             │  1. Hermes: draft plan         │  REVIEW.md    │
│  ✓ OpenCode           │  2. OpenCode: patch repo       │               │
│  ✓ Codex              │  3. Codex/pi: review patch     │ Approvals     │
│                      │                               │  file write   │
│ Shared folders        │ Tasks                          │  shell action │
│  ✓ campaign-demo      │ [todo] Draft plan              │               │
│  ! no pod provision   │ [run ] Patch repo              │               │
│                      │ [wait] Review patch            │               │
│ App skills            │                               │               │
│  ✓ JULI3TA            │ Timeline                       │               │
│  ! Blender setup      │  16:01 mission created         │               │
│                      │  16:02 Hermes complete         │               │
└──────────────────────┴───────────────────────────────┴───────────────┘
```

## Key rule

The editor is one tab, not the app identity.

Tabs can be:

- Mission Control
- README.md
- PATCH.diff
- Artifact Preview
- Settings
- Resource Details
- Run Transcript

## Empty state

Bad:

```text
Welcome to Atomek. Open file.
```

Good:

```text
What do you want Tytus to coordinate?

[ Review a repo ] [ Build an artifact ] [ Ask pods + local agents ] [ Resume mission ]

Available now:
✓ 2 pods
✓ 9 local agents
✓ 1 shared folder
✓ 6 app skills
```

## Resource card

```text
Claude Local                    local-private · available
Can: code-review, code-edit-preview, planning
Reads: mission folder + selected workspace context
Writes: runs/ transcript only; patches require approval
[Add to mission] [Open in Terminal] [Background review]
```

## Pod card

```text
Hermes pod 04                   tytus-pod · ready
Can: browser/UI, text-gen, web task
Cost: Tytus units · low
Bridge: same-origin proxy
[Add to mission] [Ask Hermes] [Open UI]
```

## Shared folder card

```text
campaign-demo                   shared-folder · ready
Local: ~/Tytus/shared/campaign-demo
Bucket: garage://...
Pods provisioned: 02, 04
[Use for mission] [Open Files] [Sync status]
```
