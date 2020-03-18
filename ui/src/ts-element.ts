import { html, LitElement, property } from 'lit-element'
import './heading-element'
import { toUpper } from './util'

export default class TsElement extends LitElement {
  @property({ type: String })
  public heading: string = 'Hello world!'

  public render() {
    return html`
      <heading-element heading="${toUpper(this.heading)}"></heading-element>
      <div><slot></slot></div>
    `
  }
}

customElements.define('ts-element', TsElement)
