import { Payment } from '@core/enterprise/entities/payment'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PaymentMapper } from './mappers/payment-mapper'

export class PaymentGateway implements IPaymentGateway {
  constructor(private readonly paymentDataSource: IPaymentDataSource) {}
  create(payment: Payment): Promise<void> {
    throw new Error('Method not implemented.')
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const payment = await this.paymentDataSource.findByOrderId(orderId)

    if (!payment) {
      return null
    }

    return PaymentMapper.toDomain(payment)
  }
}
