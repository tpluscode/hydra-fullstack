import { ViewTemplates } from '@lit-any/views'
import { html } from 'lit-html'

ViewTemplates.default.when
  .scopeMatches('hydrofoil-shell')
  .renders(text => html`<pre>${JSON.stringify(text, null, 2)}</pre>`)
