import { FindByOrderIdUseCase } from '@core/application/useCases/find-payment-use-case'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PaymentGateway } from '@infra/gateway/payment-gateway'
import { PaymentPresenter } from '@infra/presenters/payment-presenter'

export class PaymentController {
  constructor(private readonly paymentDataSource: IPaymentDataSource) {}

  async findByOrderId(orderId: string): Promise<PaymentPresenter> {
    const paymentGateway = new PaymentGateway(this.paymentDataSource)
    const findByOrderIdUseCase = new FindByOrderIdUseCase(paymentGateway)

    const { payment } = await findByOrderIdUseCase.execute({ orderId })

    return PaymentPresenter.present(payment)
  }
}
