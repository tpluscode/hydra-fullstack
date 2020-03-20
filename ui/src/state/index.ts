import { HydraResource } from 'alcaeus/types/Resources'
import * as core from './core'
// import * as pageTitle from './page-title'
import * as menu from './menu'

export interface State<T extends HydraResource | null = HydraResource | null> {
  core: core.State<T>;
  // pageTitle: pageTitle.State;
  menu: menu.State;
}

type RecursivePartial<T> = {
  [P in keyof T]?: T[P] | RecursivePartial<T[P]> | ((current: T[P]) => RecursivePartial<T[P]>);
}

/*
export type Update<T> = (patch: RecursivePartial<T>) => {
  state: RecursivePartial<T>;
  patch: false | RecursivePartial<T>;
  next: (o: { update: any; actions: any; state: T; patch: RecursivePartial<T> }) => void;
}
*/

export type Update<T> = (patchFunc: (state: T) => Partial<T>) => void

export interface ServiceParams {
  state: State;
  previousState: State;
  patch: RecursivePartial<State>;
}

export function onChange<T>(
  selector: (state: State) => T,
  acceptor: (state: State) => Partial<State>,
) {
  let previous: T | undefined

  return (state: State) => {
    let patch = {}
    const current = selector(state)
    if (previous !== current) {
      patch = acceptor(state)
    }

    previous = current
    return patch
  }
}
