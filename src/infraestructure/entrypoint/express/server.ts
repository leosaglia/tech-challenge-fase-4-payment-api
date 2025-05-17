import express from 'express'
import routes from './routes'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import globalErrorHandler from './global-error-handling'
import SqsClient from '@infra/entrypoint/sqs/config/sqs.config'

export class TechChallengeAPI {
  static start(paymentDataSource: IPaymentDataSource, sqsClient: SqsClient) {
    const app = express()
    app.use(express.json())

    // app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

    app.use((req, res, next) => {
      req.app.locals.paymentDataSource = paymentDataSource
      req.app.locals.sqsClient = sqsClient
      next()
    })

    app.use(routes)
    app.use(globalErrorHandler)

    app.listen(process.env.PORT ?? 3001, () => {
      console.log(`Server started on port ${process.env.PORT}⚡`)
    })
  }
}
