# Set up Gatekeeper gator CLI

[![build-test](https://github.com/minchao/setup-gator/actions/workflows/test.yml/badge.svg?branch=main)](https://github.com/minchao/setup-gator/actions/workflows/test.yml)

Set up your GitHub Actions workflow with a specific version of Gatekeeper gator CLI.

## Usage

Set up the workflow:

```yaml
- uses: minchao/setup-gator@v1
  with:
    version: '<version>' # default is the latest release
```

To test the all suites:

```yaml
- uses: minchao/setup-gator@v1
- run: gator test ./...
```

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
