# tabby-browser-cli

A [Tabby](https://github.com/Eugeny/tabby) plugin that opens URLs in [tabby-browser](https://github.com/karolnowacki/tabby-browser) tabs from the command line:

```bash
tabby browse google.com
```

It registers a `browse` sub-command on Tabby's own CLI, so the page opens in the Tabby window that is already running.

## Requirements

- Tabby ≥ 1.0.2xx
- the `tabby-browser` plugin (Settings → Plugins)

## Usage

```bash
tabby browse <url>            # new browser tab
tabby browse <url> --split    # split to the right of the focused pane
tabby browse <url> --webapp   # "web app" tab, no address bar
tabby browse                  # homepage from Settings → Browser
```

URLs without a scheme get `https://`; `localhost`, IP addresses and `host:port` get `http://`.

### Shell helper

`shell/browse.sh` defines a short `browse` function (bash / zsh) that also silences Electron's output:

```bash
# ~/.bashrc or ~/.zshrc
source ~/.config/tabby/plugins/node_modules/tabby-browser-cli/shell/browse.sh
```

```bash
browse google.com
browse -s localhost:3000      # split
browse -a app.example.com     # web app tab
```

Set `TABBY_BIN` if the Tabby executable is not called `tabby`.

## Limits

The command talks to the Tabby instance on the machine where it runs, so it works from local shells only — not from inside an SSH session.

## Install from source

```bash
npm install
npm run build
ln -s "$PWD" ~/.config/tabby/plugins/node_modules/tabby-browser-cli
```

Restart Tabby afterwards.

## License

MIT
