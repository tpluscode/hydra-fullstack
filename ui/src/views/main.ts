import { ViewTemplates } from '@lit-any/views'
import { html } from 'lit-html'
import { mainContent } from './scopes'
import { hasType } from './lib/matchers'
import { api } from '../namespaces'
import { State } from '../state'

ViewTemplates.default.when
  .scopeMatches(mainContent)
  .valueMatches((state: State) => hasType(api.Table, state.core.resource))
  .renders(() => html`Table`)
