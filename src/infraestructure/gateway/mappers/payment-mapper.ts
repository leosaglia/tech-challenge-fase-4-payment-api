import { Payment } from '@core/enterprise/entities/payment'
import { PaymentDto } from '@core/application/dtos/payment-dto'
import { PaymentStatus } from '@core/enterprise/enums/payment-status'
import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'

export class PaymentMapper {
  static toDomain(paymentDto: PaymentDto): Payment {
    return new Payment(
      paymentDto.orderId,
      paymentDto.status as PaymentStatus,
      paymentDto.createdAt,
      paymentDto.updatedAt,
      paymentDto.id,
    )
  }

  static toCreatePaymentDto(payment: Payment): CreatePaymentDto {
    return {
      orderId: payment.getOrderId(),
      status: payment.getStatus(),
      createdAt: payment.getCreatedAt(),
      updatedAt: payment.getUpdatedAt(),
      id: payment.getId(),
    }
  }
}
