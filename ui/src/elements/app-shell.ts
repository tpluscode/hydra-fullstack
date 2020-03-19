import { HydrofoilShell } from '@hydrofoil/hydrofoil-shell/hydrofoil-shell'
import AlcaeusLoader from '@hydrofoil/alcaeus-loader'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { IHydraResource } from 'alcaeus/types/Resources'
import '@vaadin/vaadin-app-layout/theme/material/vaadin-app-layout.js'
import '@vaadin/vaadin-app-layout/theme/material/vaadin-drawer-toggle.js'
import '@vaadin/vaadin-tabs/theme/material/vaadin-tabs'
import { html } from 'lit-html'
import { css, property } from 'lit-element'
import { repeat } from 'lit-html/directives/repeat'
import 'ld-navigation/ld-link'
import { ResourceScope, ReflectedInHistory } from 'ld-navigation'
import '../views'

export class AppShellElement extends AlcaeusLoader(ReflectedInHistory(ResourceScope(HydrofoilShell))) {
  @property()
  public title!: string

  @property()
  public menuItems: Record<string, string> = {}

  public handleResourceLoaded?: (r: IHydraResource) => void

  public static get styles() {
    return css`:host {
      height: 100vh;
      display: block;
    }`
  }

  public render() {
    return html`
      <vaadin-app-layout>
        <vaadin-drawer-toggle slot="navbar"></vaadin-drawer-toggle>
        <h2 slot="navbar">
            ${this.title}
        </h2>
        <vaadin-tabs slot="drawer" orientation="vertical" theme="minimal" style="margin: 0 auto; flex: 1;">
          ${this.__menu()}
        </vaadin-tabs>

        <div class="content">
          <h3>Page title</h3>
          <p>
              ${super.renderMain()}
          </p>
        </div>
      </vaadin-app-layout>`
  }

  protected async onResourceLoaded(resource: IHydraResponse) {
    if (this.handleResourceLoaded && resource.root) {
      this.handleResourceLoaded(resource.root)
    }
  }

  private __menu() {
    return html`${repeat(Object.entries(this.menuItems || {}), ([label, id]) => html`
    <vaadin-tab>
      <ld-link resource-url="${id}">
        ${label}
      </ld-link>
    </vaadin-tab>`)}`
  }
}

customElements.define('app-shell', AppShellElement)
