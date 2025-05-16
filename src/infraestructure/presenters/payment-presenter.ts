import { Payment } from '@core/enterprise/entities/payment'

export class PaymentPresenter {
  private readonly id: string

  private readonly orderId: string

  private readonly status: string

  private readonly createdAt: Date

  private readonly updatedAt: Date

  constructor(
    id: string,
    orderId: string,
    status: string,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id
    this.orderId = orderId
    this.status = status
    this.createdAt = createdAt
    this.updatedAt = updatedAt
  }

  static present(payment: Payment): PaymentPresenter {
    return new PaymentPresenter(
      payment.getId(),
      payment.getOrderId(),
      payment.getStatus(),
      payment.getCreatedAt(),
      payment.getUpdatedAt(),
    )
  }
}
