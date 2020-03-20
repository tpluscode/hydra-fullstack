import { NamedNode } from 'rdf-js'
import { HydraResource } from 'alcaeus/types/Resources'

export function hasType(type: NamedNode, resource: HydraResource | null): boolean {
  if (!resource || !resource.types) {
    return false
  }

  return resource.types.contains(type.value)
}
