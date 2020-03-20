import { ViewTemplates } from '@lit-any/views'
import { html } from 'lit-html'
import { Operation } from 'alcaeus/types/Resources/Operation'
import { repeat } from 'lit-html/directives/repeat'
import { operationDrawer, operationMenu } from './scopes'
import { State } from '../state/core'
import { app } from '../hydra-fullstack'

ViewTemplates.default.when
  .scopeMatches(operationDrawer)
  .renders((form: State['operationForm']) => {
    function invoke(e: CustomEvent) {
      app.then(({ actions }) => actions.core.invokeOperation(form.operation, e.detail.value))
    }

    import('@hydrofoil/alcaeus-forms/alcaeus-form')

    return html`
      <alcaeus-form no-labels
                   ?no-submit-button="${form.invoking}"
                   ?no-reset-button="${form.invoking}"
                   ?no-clear-button="${form.invoking}"
                   .operation="${form.operation || {}}"
                   @submit="${invoke}"
                   .value="${form.value || {}}"></alcaeus-form>
      ${form.error}
      ${form.invoking ? 'Operation running' : ''}`
  })

ViewTemplates.default.when
  .scopeMatches(operationMenu)
  .renders((operations: Operation[]) => {
    function toggle(operation: Operation) {
      return () => {
        app.then(({ actions }) => actions.core.showOperationForm(operation))
      }
    }

    return html`${repeat(operations, operation => html`
      <vaadin-tab slot="drawer"
                 @click="${toggle(operation)}">
        ${operation.title}
      </vaadin-tab>
    `)}`
  })
