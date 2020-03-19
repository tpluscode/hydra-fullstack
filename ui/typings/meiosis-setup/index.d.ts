declare module 'meiosis-setup/functionPatches' {
  import flyd from 'flyd'

  export default function meiosis<TState, TActions>(opts: {
    stream: any;
    app: any;
  }): Promise<{
    updates: any;
    models: any;
    states: flyd.Stream<TState>;
    actions: TActions;
  }>
}
