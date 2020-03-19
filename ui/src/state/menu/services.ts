import { DocumentedResource } from 'alcaeus/types/Resources'
import { ServiceParams } from '../index'

function populateMenu({ state }: ServiceParams) {
  const menu = state.core.entrypoint
    .getLinks()
    .reduce((map, { supportedProperty, resources }) => {
      const resource = resources[0] as DocumentedResource

      return {
        ...map,
        [resource.title || supportedProperty.title]: resources[0].id,
      }
    }, {})

  return {
    state: () => ({
      ...state,
      menu: {
        ...state.menu,
        items: {
          Home: state.core.entrypoint.id,
          ...menu,
        },
      },
    }),
  }
}

export const services = [populateMenu]
