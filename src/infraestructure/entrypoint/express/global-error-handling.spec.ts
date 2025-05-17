import { describe, it, expect, vi } from 'vitest'
import globalErrorHandler from './global-error-handling'
import { Request, Response, NextFunction } from 'express'

describe('globalErrorHandler', () => {
  const req = {} as Request
  const next = vi.fn() as NextFunction
  let res: Response

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response
  })

  it('should handle PaymentNotFoundError', () => {
    const err = { name: 'PaymentNotFoundError', message: 'Not found' } as Error
    globalErrorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(404)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 404,
      message: 'Not found',
    })
  })

  it('should handle PaymentAlreadyExistsError', () => {
    const err = {
      name: 'PaymentAlreadyExistsError',
      message: 'Already exists',
    } as Error
    globalErrorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 409,
      message: 'Already exists',
    })
  })

  it('should handle unknown errors as 500', () => {
    const err = { name: 'OtherError', message: 'Unknown error' } as Error
    globalErrorHandler(err, req, res, next)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
      statusCode: 500,
      message: 'Unknown error',
    })
  })
})
