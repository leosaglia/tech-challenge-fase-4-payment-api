import { Payment } from '@core/enterprise/entities/payment'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'
import { PaymentNotFoundError } from '@core/enterprise/custom-exceptions/payment-not-found'
import { FindPaymentDto } from '@core/application/dtos/find-payment-dto'

type findByOrderIdUseCaseResponse = {
  payment: Payment
}

export class FindByOrderIdUseCase {
  constructor(private readonly paymentGateway: IPaymentGateway) {}

  async execute({
    orderId,
  }: FindPaymentDto): Promise<findByOrderIdUseCaseResponse> {
    const payment = await this.paymentGateway.findByOrderId(orderId)

    if (!payment) {
      throw new PaymentNotFoundError(
        'Payment not found for order ID: ' + orderId,
      )
    }

    return { payment }
  }
}
