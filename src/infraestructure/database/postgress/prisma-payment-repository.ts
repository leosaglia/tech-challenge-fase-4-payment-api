import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'
import { PaymentDto } from '@core/application/dtos/payment-dto'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { PrismaPaymentMapper } from './mappers/prisma-payment-mapper'

export default class PrismaPaymentRepository implements IPaymentDataSource {
  constructor(private readonly prisma: PrismaService) {}

  async create(payment: CreatePaymentDto): Promise<void> {
    const data = PrismaPaymentMapper.toPersistence(payment)

    await this.prisma.payment.create({
      data,
    })
  }

  async findByOrderId(orderId: string): Promise<PaymentDto | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
    })

    if (!payment) {
      return null
    }

    return PrismaPaymentMapper.toDto(payment)
  }
}
