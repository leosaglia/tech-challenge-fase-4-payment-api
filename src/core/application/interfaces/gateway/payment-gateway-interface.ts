import { Payment } from '@core/enterprise/entities/payment'

export interface IPaymentGateway {
  create(payment: Payment): Promise<void>
  findByOrderId(orderId: string): Promise<Payment | null>
}
