import { describe, it, expect, vi, beforeEach } from 'vitest'
import PrismaPaymentRepository from './prisma-payment-repository'
import { PrismaService } from '@infra/database/prisma/prisma.service'

// Define explicit type for mock PrismaService
interface PrismaServiceMock {
  payment: {
    create: ReturnType<typeof vi.fn>
    findUnique: ReturnType<typeof vi.fn>
  }
}

const mockPrisma: PrismaServiceMock = {
  payment: {
    create: vi.fn(),
    findUnique: vi.fn(),
  },
}

vi.mock('./mappers/prisma-payment-mapper', () => ({
  PrismaPaymentMapper: {
    toPersistence: vi.fn((payment) => ({ ...payment, mapped: true })),
    toDto: vi.fn((payment) => ({ ...payment, dto: true })),
  },
}))

describe('PrismaPaymentRepository', () => {
  let repository: PrismaPaymentRepository

  beforeEach(() => {
    mockPrisma.payment.create.mockReset()
    mockPrisma.payment.findUnique.mockReset()
    repository = new PrismaPaymentRepository(
      mockPrisma as unknown as PrismaService,
    )
  })

  it('should call prisma.payment.create with mapped data', async () => {
    const payment = {
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    await repository.create(payment)
    expect(mockPrisma.payment.create).toHaveBeenCalledWith({
      data: { ...payment, mapped: true },
    })
  })

  it('should return dto when payment is found by orderId', async () => {
    const paymentDb = {
      id: '2',
      orderId: 'order-2',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockPrisma.payment.findUnique.mockResolvedValue(paymentDb)
    const result = await repository.findByOrderId('order-2')
    expect(result).toEqual({ ...paymentDb, dto: true })
  })

  it('should return null when payment is not found by orderId', async () => {
    mockPrisma.payment.findUnique.mockResolvedValue(null)
    const result = await repository.findByOrderId('order-x')
    expect(result).toBeNull()
  })
})
