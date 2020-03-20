import { ViewTemplates } from '@lit-any/views'
import { html } from 'lit-html'
import { State } from '../state'
import * as scope from './scopes'

import './main'
import './operation'

ViewTemplates.default.when
  .scopeMatches('hydrofoil-shell')
  .valueMatches((state: State) => state.core.debug)
  .renders((state: State) => html`<pre>${JSON.stringify(state, null, 2)}</pre>`)

ViewTemplates.default.when
  .scopeMatches('hydrofoil-shell')
  .renders((state: State, next) => html`
    <vaadin-app-layout .drawerOpened="${state.core.operationForm?.opened}">
      <vaadin-tabs slot="drawer" orientation="vertical" theme="minimal" style="margin: 0 auto; flex: 1;">
        ${next(state.core.operationForm, scope.operationDrawer)}
      </vaadin-tabs>

      <div class="content">
        ${next(state, scope.mainContent)}
      </div>
    </vaadin-app-layout>`)
