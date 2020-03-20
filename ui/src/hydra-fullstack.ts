import '@vaadin/vaadin-checkbox/vaadin-checkbox'
import { HydraResource } from 'alcaeus/types/Resources'
import { LitElement, html, query, property } from 'lit-element'
import { AppShellElement } from './elements/app-shell'
import './elements/app-shell.ts'
import createApp, { State } from './state/app'
import { operationMenu } from './views/scopes'

type NullState<T> = {
  [P in keyof T]: Partial<T[P]>
}

export const app = createApp(process.env.API_ROOT)

class HydraFullstackElement extends LitElement {
  @query('app-shell')
  private __shell!: AppShellElement

  @property()
  private __state: NullState<State> = {
    core: {},
    menu: {},
  }

  private get __pageTitle() {
    const { entrypoint } = this.__state.core

    if (entrypoint && 'title' in entrypoint) {
      return entrypoint.title
    }

    return ''
  }

  public async connectedCallback(): Promise<void> {
    super.connectedCallback()

    import('./views')
    import('./forms')

    const { states } = await app

    states.map((state: State) => {
      this.__state = state
    })
  }

  public render() {
    return html`
      <app-shell base-url="${process.env.API_ROOT}"
                .handleResourceLoaded="${this.__setResource}"
                .appTitle="${this.__state.core.title || 'Please wait...'}"
                .title="${this.__pageTitle}"
                .model="${this.__state}"
                .menuItems="${this.__state.menu.items}">

        <lit-view slot="drawer" .value="${this.__state.core.operations}" template-scope="${operationMenu}"></lit-view>

        <vaadin-tab slot="drawer">
          <vaadin-checkbox .checked="${this.__state.core.debug}" @change="${this.debug}">Debug view</vaadin-checkbox>
        </vaadin-tab>
    </app-shell>
    `
  }

  private async __setResource(r: HydraResource) {
    const { actions } = await app

    actions.core.setResource(r)
  }

  // eslint-disable-next-line class-methods-use-this
  private debug() {
    app.then(({ actions }) => actions.core.toggleDebug())
  }
}

customElements.define('hydra-fullstack', HydraFullstackElement)
