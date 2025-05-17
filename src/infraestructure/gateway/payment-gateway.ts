import { Payment } from '@core/enterprise/entities/payment'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PaymentMapper } from './mappers/payment-mapper'

export class PaymentGateway implements IPaymentGateway {
  constructor(private readonly paymentDataSource: IPaymentDataSource) {}
  async create(payment: Payment): Promise<void> {
    await this.paymentDataSource.create(
      PaymentMapper.toCreatePaymentDto(payment),
    )
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const payment = await this.paymentDataSource.findByOrderId(orderId)

    if (!payment) {
      return null
    }

    return PaymentMapper.toDomain(payment)
  }
}
