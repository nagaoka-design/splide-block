# Release v1.0.0 (2025-12-15)

Note: This is a beta (pre-release) version. When publishing on GitHub, mark the release as a "Pre-release" and attach `splide-block-1.0.0.zip` or the beta ZIP if you rename it.

Short summary

- 初回リリース: Splide ブロックプラグインのベータ版（v1.0.0）

What's included

- `splide-block.php` — プラグイン本体
- `assets/` と `build/` — コンパイル済みアセット
- `readme.txt`, `README.md`, `LICENSE.txt`

Third-party

- Splide.js (MIT License) — included in `assets/`

Installation

1. GitHub Releases から `splide-block-1.0.0.zip` をダウンロード
2. WordPress 管理画面 → プラグイン → 新規追加 → アップロードで ZIP を選択
3. 有効化して動作確認

Notes for publishing release on GitHub

1. Go to the repository's Releases page
2. Click "Draft a new release"
3. Select tag: `v1.0.0` (already created)
4. Title: `v1.0.0`
5. Description: copy content of this file or a short summary
6. Attach `splide-block-1.0.0.zip` (generated via `npm run package`)
7. Publish release
