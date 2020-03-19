import { HydraResource } from 'alcaeus/types/Resources'
import { LitElement, html, query, property } from 'lit-element'
import { AppShellElement } from './elements/app-shell'
import './elements/app-shell.ts'
import createApp, { State } from './state/app'

type NullState<T> = {
  [P in keyof T]: Partial<T[P]>
}

const app = createApp('http://hydra-fullstack.lndo.site')

class HydraFullstackElement extends LitElement {
  @query('app-shell')
  private __shell!: AppShellElement

  @property()
  private __state: NullState<State> = {
    core: {},
    menu: {},
  }

  public async connectedCallback(): Promise<void> {
    super.connectedCallback()

    const { states } = await app

    states.map((state: State) => {
      this.__state = state
    })
  }

  public render() {
    return html`
      <app-shell base-url="http://hydra-fullstack.lndo.site"
                .handleResourceLoaded="${this.__setResource}"
                .title="${this.__state.core.title || 'Please wait...'}"
                .model="${this.__state}"
                .menuItems="${this.__state.menu.items}"></app-shell>
    `
  }

  private async __setResource(r: HydraResource) {
    const { actions } = await app

    actions.core.setResource(r)
  }
}

customElements.define('hydra-fullstack', HydraFullstackElement)
