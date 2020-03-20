import flyd from 'flyd'
import meiosis from 'meiosis-setup/functionPatches'
import { State } from './index'
import * as coreState from './core'
import * as menu from './menu'

export { State } from './index'

async function createApp(rootUri?: string) {
  const coreInitial = await coreState.Initial(rootUri)

  return {
    initial: {
      core: coreInitial,
      menu: menu.Initial(),
    },
    Actions(update: flyd.Stream<any>) {
      return {
        core: coreState.Actions((patch: any) => update((state: any) => ({ ...state, core: { ...state.core, ...patch(state.core) } }))),
      }
    },
    services: [...coreState.services, ...menu.services],
  }
}

export default (rootUri?: string) => createApp(rootUri).then(app => meiosis<State, ReturnType<typeof app.Actions>>({ stream: flyd, app }))
