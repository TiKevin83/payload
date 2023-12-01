// @ts-strict-ignore
import type { NextFunction, Response } from 'express'

import httpStatus from 'http-status'

import type { PayloadRequest } from '../../express/types'
import type { Document, Where } from '../../types'

import formatSuccessResponse from '../../express/responses/formatSuccess'
import { getTranslation } from '../../utilities/getTranslation'
import deleteOperation from '../operations/delete'

export type DeleteResult = {
  doc: Document
  message: string
}

export default async function deleteHandler(
  req: PayloadRequest,
  res: Response,
  next: NextFunction,
): Promise<Response<DeleteResult> | void> {
  try {
    const result = await deleteOperation({
      collection: req.collection,
      depth: parseInt(String(req.query.depth), 10),
      req,
      where: req.query.where as Where,
    })

    if (result.errors.length === 0) {
      const message = req.t('general:deletedCountSuccessfully', {
        count: result.docs.length,
        label: getTranslation(
          req.collection.config.labels[result.docs.length > 1 ? 'plural' : 'singular'],
          req.i18n,
        ),
      })

      res.status(httpStatus.OK).json({
        ...formatSuccessResponse(message, 'message'),
        ...result,
      })
      return
    }

    const total = result.docs.length + result.errors.length
    const message = req.t('error:unableToDeleteCount', {
      count: result.errors.length,
      label: getTranslation(
        req.collection.config.labels[total > 1 ? 'plural' : 'singular'],
        req.i18n,
      ),
      total,
    })

    res.status(httpStatus.BAD_REQUEST).json({
      message,
      ...result,
    })
  } catch (error) {
    next(error)
  }
}
