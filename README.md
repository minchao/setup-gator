# Set up Gatekeeper gator CLI

[![build-test](https://github.com/minchao/setup-gator/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/minchao/setup-gator/actions/workflows/test.yml)

Set up your GitHub Actions workflow with a specific version of [Gatekeeper gator CLI](https://open-policy-agent.github.io/gatekeeper/website/docs/gator).

## Usage

Set up the workflow:

```yaml
- uses: minchao/setup-gator@v2
```

> default is the latest release.

Set up the workflow with a specific version:

```yaml
- uses: minchao/setup-gator@v2
  with:
    version: 'v3.7.1'
```

To test the all unit test suites:

```yaml
- uses: minchao/setup-gator@v2
- run: gator test ./...
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
