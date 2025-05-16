import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'
import { PaymentDto } from '@core/application/dtos/payment-dto'

export interface IPaymentDataSource {
  create(payment: CreatePaymentDto): Promise<void>
  findByOrderId(orderId: string): Promise<PaymentDto | null>
}
