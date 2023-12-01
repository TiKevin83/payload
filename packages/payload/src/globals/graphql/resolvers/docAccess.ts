// @ts-strict-ignore
import type { CollectionPermission, GlobalPermission } from '../../../auth'
import type { PayloadRequest } from '../../../express/types'
import type { SanitizedGlobalConfig } from '../../config/types'

import isolateTransactionID from '../../../utilities/isolateTransactionID'
import { docAccess } from '../../operations/docAccess'

export type Resolver = (
  _: unknown,
  context: {
    req: PayloadRequest
    res: Response
  },
) => Promise<CollectionPermission | GlobalPermission>

export function docAccessResolver(global: SanitizedGlobalConfig): Resolver {
  async function resolver(_, context) {
    return docAccess({
      globalConfig: global,
      req: isolateTransactionID(context.req),
    })
  }

  return resolver
}
