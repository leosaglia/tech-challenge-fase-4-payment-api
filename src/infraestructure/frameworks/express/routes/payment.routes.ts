/* eslint-disable @typescript-eslint/ban-types */
import { Router, Request, Response, NextFunction } from 'express'
import { PaymentController } from '@infra/controllers/payment-controller'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'

const paymentRouter = Router()

paymentRouter.get(
  '/:orderId',
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const dataSource: IPaymentDataSource =
        request.app.locals.paymentDataSource
      const paymentController = new PaymentController(dataSource)
      const { orderId } = request.params
      const payment = await paymentController.findByOrderId(orderId)

      response.json(payment)
    } catch (error) {
      next(error)
    }
  },
)

export default paymentRouter
