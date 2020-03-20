import { HydraResource, IOperation } from 'alcaeus/types/Resources'
import { Hydra } from 'alcaeus'
import { IHydraResponse } from 'alcaeus/types/HydraResponse'
import { rdfs } from '@tpluscode/rdf-ns-builders'
import { Operation } from 'alcaeus/types/Resources/Operation'
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
  operations: Operation[];
}

export async function Initial(rootUri?: string): Promise<State> {
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
    operations: [],
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

  ({ state }: ServiceParams) => {
    const { resource } = state.core
    if (!resource) {
      return {}
    }

    return {
      state: () => ({
        ...state,
        core: {
          ...state.core,
          operations: resource.findOperations(),
        },
      }),
    }
  },

  ({ state, previousState }: ServiceParams) => {
    if (state.core.resource?.id !== previousState.core.resource?.id) {
      return {
        state: () => ({
          ...state,
          core: {
            ...state.core,
            operationForm: {
              ...state.core.operationForm,
              operation: undefined,
              opened: false,
            },
          },
        }),
      }
    }

    return {}
  },
]

export function Actions(update: Update<State>) {
  return {
    toggleDebug() {
      update(state => ({
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
      update(({ operationForm }) => {
        let { opened, value } = operationForm
        const sameOperation = operationForm.operation?.supportedOperation.id === operation.supportedOperation.id

        if (sameOperation) {
          opened = !opened
        } else {
          opened = true
          value = undefined
        }

        return ({
          operationForm: {
            ...operationForm,
            opened,
            invoking: false,
            operation,
            value,
            error: undefined,
          },
        })
      })
    },
    hideOperationForm() {
      update(({ operationForm }) => {
        if (operationForm.invoking) {
          return { operationForm }
        }

        return ({
          operationForm: {
            ...operationForm,
            opened: false,
          },
        })
      })
    },
    setOperationValue(value: object) {
      update(({ operationForm }) => ({
        operationForm: {
          ...operationForm,
          value,
        },
      }))
    },
    invokeOperation(operation: IOperation, value: object) {
      update(state => ({
        operationForm: {
          ...state.operationForm,
          invoking: true,
          error: undefined,
          value,
        },
      }))

      const body = JSON.stringify(value)
      operation
        .invoke(body)
        .then(response => {
          if (!response.xhr.ok) {
            update(state => ({
              operationForm: {
                ...state.operationForm,
                invoking: false,
                error: 'Request failed',
              },
            }))
            return
          }

          update((state) => ({
            operationForm: {
              ...state.operationForm,
              opened: false,
            },
          }))

          if (response.root) {
            const { root } = response
            update(state => ({
              operationForm: {
                ...state.operationForm,
                operation: undefined,
              },
              resource: root,
              resourceUrlOverride: root.id,
            }))
          } else {
            update(state => ({
              requestRefresh: true,
            }))
          }
        })
        .catch(e => {
          update(state => ({
            operationForm: {
              ...state.operationForm,
              error: e.message,
            },
          }))
        })
        .finally(() => {
          update(state => ({
            operationForm: {
              ...state.operationForm,
              invoking: false,
            },
          }))
        })
    },
  }
}
