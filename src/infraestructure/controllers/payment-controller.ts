import { FindByOrderIdUseCase } from '@core/application/useCases/find-payment-use-case'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PaymentGateway } from '@infra/gateway/payment-gateway'
import { PaymentPresenter } from '@infra/presenters/payment-presenter'
import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'
import { RegisterPaymentUseCase } from '@core/application/useCases/register-payment-use-case'

export class PaymentController {
  constructor(private readonly paymentDataSource: IPaymentDataSource) {}

  async findByOrderId(orderId: string): Promise<PaymentPresenter> {
    const paymentGateway = new PaymentGateway(this.paymentDataSource)
    const findByOrderIdUseCase = new FindByOrderIdUseCase(paymentGateway)

    const { payment } = await findByOrderIdUseCase.execute({ orderId })

    return PaymentPresenter.present(payment)
  }

  async registerPayment(data: CreatePaymentDto): Promise<PaymentPresenter> {
    const paymentGateway = new PaymentGateway(this.paymentDataSource)
    const registerPaymentUseCase = new RegisterPaymentUseCase(paymentGateway)

    const { payment } = await registerPaymentUseCase.execute(data)

    return PaymentPresenter.present(payment)
  }
}
