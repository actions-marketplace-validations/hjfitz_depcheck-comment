# 🤖💬 Depcheck Comment

## Scan a pull request to see if any dependencies are unused

Use this GitHub Action to scan a pull request and check if any dependencies are unused. This can help with things like primitive bundling and WebApp deployment times.

**Prerequisites:** None!

---

Sample `action.yml` file:

```yaml
name: Depcheck

on: pull_request

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: hjfitz/depcheck-comment@master
        with:
          GITHUB_TOKEN: ${{secrets.GITHUB_TOKEN}}
```
