import { NgModule, Injectable } from '@angular/core'
import {
    AppService,
    CLIEvent,
    CLIHandler,
    ConfigService,
    HostWindowService,
    NotificationsService,
    SplitTabComponent,
    TabsService,
} from 'tabby-core'

declare const __non_webpack_require__: (id: string) => any

const COMMAND = 'browse'

/**
 * Turns whatever was typed on the command line into a loadable URL:
 * - anything with a scheme is left alone
 * - localhost / IPs / host:port default to http://
 * - everything else defaults to https://
 */
export function normalizeUrl (raw: string): string {
    const input = raw.trim()
    if (!input) {
        return ''
    }
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(input) || /^(about|file|data):/i.test(input)) {
        return input
    }
    const host = input.split(/[/?#]/)[0]
    const isLocal =
        /^localhost(:\d+)?$/i.test(host) ||
        /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/.test(host) ||
        /^\[[0-9a-f:]+\](:\d+)?$/i.test(host) ||
        /^[^.]+:\d+$/.test(host)
    return `${isLocal ? 'http' : 'https'}://${input}`
}

/** @hidden */
@Injectable()
export class BrowseCLIHandler extends CLIHandler {
    firstMatchOnly = true
    priority = 0

    constructor (
        private app: AppService,
        private tabs: TabsService,
        private config: ConfigService,
        private hostWindow: HostWindowService,
        private notifications: NotificationsService,
    ) {
        super()
    }

    async handle (event: CLIEvent): Promise<boolean> {
        const positional: any[] = event.argv?._ ?? []
        if (positional[0] !== COMMAND) {
            return false
        }

        const tabType = this.getBrowserTabType()
        if (!tabType) {
            this.notifications.error('tabby-browser-cli: the tabby-browser plugin is not installed')
            return true
        }

        const homepage: string = this.config.store.browser?.homepage ?? ''
        const url = normalizeUrl(String(positional[1] ?? '')) || homepage
        const params = {
            type: tabType,
            inputs: {
                url,
                chromeless: !!event.argv.webapp,
            },
        }

        if (event.argv.split && await this.openInSplit(params)) {
            this.hostWindow.bringToFront()
            return true
        }

        this.app.openNewTab(params)
        this.hostWindow.bringToFront()
        return true
    }

    /** Opens the page to the right of the focused pane of the active tab. */
    private async openInSplit (params: any): Promise<boolean> {
        const parent = this.app.activeTab
        if (!(parent instanceof SplitTabComponent)) {
            return false
        }
        const tab = this.tabs.create(params)
        await parent.addTab(tab, parent.getFocusedTab(), 'r')
        return true
    }

    /** tabby-browser is resolved lazily so this plugin still loads without it. */
    private getBrowserTabType (): any {
        try {
            return __non_webpack_require__('tabby-browser').BrowserTabComponent ?? null
        } catch {
            return null
        }
    }
}

/** @hidden */
@NgModule({
    providers: [
        { provide: CLIHandler, useClass: BrowseCLIHandler, multi: true },
    ],
})
export default class BrowserCLIModule { }
