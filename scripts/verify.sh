#!/usr/bin/env bash
set -euo pipefail

echo "[verify] lint"
npm run lint

echo "[verify] build"
npm run build

echo "[verify] test"
npm test

echo "[verify] all checks passed"
