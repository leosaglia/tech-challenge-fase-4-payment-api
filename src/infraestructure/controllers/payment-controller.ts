import { FindByOrderIdUseCase } from '@core/application/useCases/find-payment-use-case'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PaymentGateway } from '@infra/gateway/payment-gateway'
import { PaymentPresenter } from '@infra/presenters/payment-presenter'
import { RegisterPaymentUseCase } from '@core/application/useCases/register-payment-use-case'
import SqsClient from '@infra/entrypoint/sqs/config/sqs.config'
import { RegisterPaymentDto } from '@core/application/dtos/register-payment-use-case-dto'

export class PaymentController {
  private readonly queueUrl: string

  constructor(
    private readonly paymentDataSource: IPaymentDataSource,
    private readonly sqsClient: SqsClient,
  ) {
    this.queueUrl = process.env.PROCESSED_PAYMENT_QUEUE_URL ?? ''
  }

  async findByOrderId(orderId: string): Promise<PaymentPresenter> {
    const paymentGateway = new PaymentGateway(this.paymentDataSource)
    const findByOrderIdUseCase = new FindByOrderIdUseCase(paymentGateway)

    const { payment } = await findByOrderIdUseCase.execute({ orderId })

    return PaymentPresenter.present(payment)
  }

  async registerPayment(data: RegisterPaymentDto): Promise<PaymentPresenter> {
    const paymentGateway = new PaymentGateway(this.paymentDataSource)
    const registerPaymentUseCase = new RegisterPaymentUseCase(paymentGateway)

    const { payment } = await registerPaymentUseCase.execute(data)

    const paymentPresenter = PaymentPresenter.present(payment)

    await this.sqsClient.sendMessage(this.queueUrl, paymentPresenter)

    return paymentPresenter
  }
}
