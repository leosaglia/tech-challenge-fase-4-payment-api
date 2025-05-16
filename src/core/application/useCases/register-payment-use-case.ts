import { Payment } from '@core/enterprise/entities/payment'
import { PaymentStatus } from '@core/enterprise/enums/payment-status'
import { RegisterPaymentDto } from '@core/application/dtos/register-payment-use-case-dto'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'
import { PaymentAlreadyExistsError } from '@core/enterprise/custom-exceptions/payment-already-exists'

type RegisterPaymentUseCaseResponse = {
  payment: Payment
}

export class RegisterPaymentUseCase {
  constructor(private readonly paymentGateway: IPaymentGateway) {}

  async execute({
    orderId,
  }: RegisterPaymentDto): Promise<RegisterPaymentUseCaseResponse> {
    const existingPayment = await this.paymentGateway.findByOrderId(orderId)

    if (existingPayment) {
      throw new PaymentAlreadyExistsError('Payment already exists.')
    }

    const payment = new Payment(orderId, PaymentStatus.PAID)

    await this.paymentGateway.create(payment)

    return { payment }
  }
}
