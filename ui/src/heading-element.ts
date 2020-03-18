import { html, LitElement, property } from 'lit-element'

export default class HeadingElement extends LitElement {
  @property({ type: String })
  public heading: string = ''

  public render() {
    return html`
      <h1>${this.heading}</h1>
    `
  }
}

customElements.define('heading-element', HeadingElement)
