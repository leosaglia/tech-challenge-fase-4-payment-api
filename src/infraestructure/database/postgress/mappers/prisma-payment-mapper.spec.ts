import { describe, it, expect } from 'vitest'
import { PrismaPaymentMapper } from './prisma-payment-mapper'
import { PaymentDto } from '@core/application/dtos/payment-dto'
import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'
import { Prisma, Payment as PrismaPayment } from '@prisma/client'

describe('PrismaPaymentMapper', () => {
  it('should map PrismaPayment to PaymentDto', () => {
    const raw: PrismaPayment = {
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    }
    const dto: PaymentDto = PrismaPaymentMapper.toDto(raw)
    expect(dto).toEqual({
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    })
  })

  it('should map CreatePaymentDto to Prisma.PaymentUncheckedCreateInput', () => {
    const payment: CreatePaymentDto = {
      id: '2',
      orderId: 'order-2',
      status: 'APPROVED',
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-02'),
    }
    const prismaInput: Prisma.PaymentUncheckedCreateInput =
      PrismaPaymentMapper.toPersistence(payment)
    expect(prismaInput).toEqual({
      id: '2',
      orderId: 'order-2',
      status: 'APPROVED',
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-02'),
    })
  })
})
