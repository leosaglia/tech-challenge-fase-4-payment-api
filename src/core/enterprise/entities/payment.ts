import { UniqueEntityId } from '@core/enterprise/valueObjects/unique-entity-id'
import { PaymentStatus } from '@core/enterprise/enums/payment-status'

export class Payment {
  id: UniqueEntityId
  createdAt: Date
  updatedAt: Date
  status: PaymentStatus

  constructor(
    private readonly orderId: string,
    status?: PaymentStatus,
    createdAt?: Date,
    updatedAt?: Date,
    id?: string,
  ) {
    this.orderId = orderId
    this.id = new UniqueEntityId(id)
    this.status = status ?? PaymentStatus.PENDING
    this.createdAt = createdAt ?? new Date()
    this.updatedAt = updatedAt ?? new Date()
  }

  public getId(): string {
    return this.id.getValue()
  }

  public getOrderId(): string {
    return this.orderId
  }

  public getStatus(): PaymentStatus {
    return this.status
  }

  public getCreatedAt(): Date {
    return this.createdAt
  }

  public getUpdatedAt(): Date {
    return this.updatedAt
  }
}
