export { services } from './services'

export interface State {
  items: Record<string, string>;
  current: string;
}

export function Initial(): State {
  return {
    items: {},
    current: '',
  }
}
