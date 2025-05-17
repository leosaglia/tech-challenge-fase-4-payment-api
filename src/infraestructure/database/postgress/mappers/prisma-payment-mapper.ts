import { Prisma, Payment as PrismaPayment } from '@prisma/client'
import { PaymentDto } from '@core/application/dtos/payment-dto'
import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'

export class PrismaPaymentMapper {
  static toDto(raw: PrismaPayment): PaymentDto {
    return {
      id: raw.id,
      orderId: raw.orderId,
      status: raw.status,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }
  }

  static toPersistence(
    payment: CreatePaymentDto,
  ): Prisma.PaymentUncheckedCreateInput {
    return {
      id: payment.id,
      orderId: payment.orderId,
      status: payment.status,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    }
  }
}
