# tabby-browser-cli — shell helper (bash / zsh)
# Source this file from ~/.bashrc or ~/.zshrc:
#   source /path/to/tabby-browser-cli/shell/browse.sh
#
#   browse google.com            new browser tab
#   browse -s google.com         split to the right of the current pane
#   browse -a localhost:3000     "web app" tab (no address bar)
#   browse                       homepage set in Settings → Browser

browse() {
    local args=()
    while [ $# -gt 0 ]; do
        case "$1" in
            -s|--split) args+=(--split) ;;
            -a|--app)   args+=(--webapp) ;;
            *)          args+=("$1") ;;
        esac
        shift
    done
    ( "${TABBY_BIN:-tabby}" browse "${args[@]}" >/dev/null 2>&1 & )
}
