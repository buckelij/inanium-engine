workflow "ci" {
  resolves = [
    "Inanium Engine CI"
  ]
  on = "push"
}

action "Inanium Engine CI" {
  uses = "./.github/actions/ci"
}
