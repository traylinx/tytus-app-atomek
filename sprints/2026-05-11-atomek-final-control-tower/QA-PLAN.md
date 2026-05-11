# QA Plan

## Static gates

In `tytus-app-atomek`:

```bash
npm run typecheck
npm run build
npm run release:check
```

If host API changes in `tytus-os`:

```bash
npm run typecheck
npm run build
```

If tray changes in `tytus-cli`:

```bash
cargo check -p tytus-tray
cargo test -p tytus-tray web_server -- --nocapture
```

## Runtime smoke

Run against live `localhost:4242`:

1. Open Atomek.
2. Start mission.
3. Confirm mission folder created under `/Users/sebastian/Tytus/Missions/`.
4. Confirm complete folder protocol.
5. Run one local agent background job.
6. Cancel one local agent job.
7. Resume mission.
8. Use chat with mission context.
9. Generate a patch proposal and preview it.
10. Check responsive layout.

## Visual checks

- Landing is not cluttered.
- Mission Board shows real task/resource/output state.
- Resource Setup separates ready vs setup-needed.
- No fake “coming soon” as primary actions.
- Chat and editor are selectable/copyable.
- Buttons say what they do.

## Security checks

- No raw secrets in mission files.
- No direct pod URL/browser CORS fetch for dispatch.
- No hardcoded model IDs.
- No shell command from model output without approval.
- No external channel send without explicit approval.

## Release gates

1. Version bump.
2. Build dist.
3. Update `tytus-app.json` entry URL.
4. Tag app release.
5. Update `tytus-app-catalog` pin.
6. Update TytusOS docs/manual if host/app behavior changed.
7. GitHub release.
8. Live CDN/catalog verification.
