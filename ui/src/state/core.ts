import { HydraResource, IOperation } from 'alcaeus/types/Resources'
import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { ServiceParams, Update } from './index'

Hydra.rootSelectors = [Hydra.rootSelectors.pop() as any, ...Hydra.rootSelectors]

export interface OperationFormState {
  opened: boolean;
  invoking: boolean;
  operation?: IOperation;
  value?: any;
  error?: string;
}

export interface State<T extends HydraResource | null = HydraResource | null> {
  debug: boolean;
  resource: T;
  resourceUrlOverride: string | null;
  entrypoint: HydraResource;
  operationForm: OperationFormState;
  requestRefresh?: boolean;
  isLoading: boolean;
  title?: string;
}

export async function Initial(rootUri: string): Promise<State> {
  if (!rootUri) {
    throw new Error('Failed to initialize app. API_ROOT environment variable was not set')
  }

  let response: IHydraResponse
  try {
    response = await Hydra.loadResource(rootUri)
  } catch (e) {
    throw new Error('Failed to initialize app. Could not fetch root entrypoint')
  }
  if (!response.root) {
    throw new Error('Failed to initialize app. Could not fetch root entrypoint')
  }

  return {
    debug: false,
    isLoading: false,
    resource: null,
    resourceUrlOverride: null,
    entrypoint: response.root,
    operationForm: {
      invoking: false,
      opened: false,
    },
  }
}

export const services = [
  ({ state }: ServiceParams) => ({
    state: () => ({
      ...state,
      core: {
        ...state.core,
        title: state.core.entrypoint.get(rdfs.label.value),
      },
    }),
  }),

  async ({ state }: ServiceParams) =>
    ({
      state: {
        core: {
          requestRefresh: false,
          isLoading: false,
        },
      },
    }),

]

export function Actions(update: Update<State>) {
  return {
    toggleDebug() {
      update(state => ({
        ...state,
        debug: !state.debug,
      }))
    },
    setResource(resource: HydraResource) {
      update((s) => ({
        ...s,
        resource,
        resourceUrlOverride: null,
      }))
    },
    showOperationForm(operation: IOperation) {
      update((state) => ({
        ...state,
        operationForm: {
          opened: true,
          invoking: false,
          operation,
          value: undefined,
          error: undefined,
        },
      }))
    },
    hideOperationForm() {
      update(state => ({
        ...state,
        operationForm: {
          ...state.operationForm,
          opened: false,
        },
      }))
    },
    invokeOperation(operation: IOperation, value: object) {
      update(state => ({
        ...state,
        operationForm: {
          ...state.operationForm,
          invoking: true,
          error: undefined,
          value,
        },
      }))

      const body = JSON.stringify(value)
      return operation
        .invoke(body)
        .then(response => {
          if (response.xhr.ok) {
            update((state) => ({
              ...state,
              operationForm: {
                ...state.operationForm,
                opened: false,
              },
            }))

            if (response.root) {
              const { root } = response
              update(state => ({
                ...state,
                resource: root,
                resourceUrlOverride: root.id,
              }))
            } else {
              update(state => ({
                ...state,
                requestRefresh: true,
              }))
            }
          }

          update(state => ({
            ...state,
            operationForm: {
              ...state.operationForm,
              invoking: false,
            },
          }))
        })
        .catch(e => {
          update(state => ({
            ...state,
            operationForm: {
              ...state.operationForm,
              error: e.message,
            },
          }))
        })
        .finally(() => {
          update(state => ({
            ...state,
            operationForm: {
              ...state.operationForm,
              invoking: false,
            },
          }))
        })
    },
  }
}
