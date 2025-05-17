import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PaymentGateway } from './payment-gateway'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { Payment } from '@core/enterprise/entities/payment'
import { PaymentStatus } from '@core/enterprise/enums/payment-status'

vi.mock('./mappers/payment-mapper', () => ({
  PaymentMapper: {
    toCreatePaymentDto: vi.fn(() => ({
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    toDomain: vi.fn((dto) => ({ ...dto, domain: true })),
  },
}))

describe('PaymentGateway', () => {
  let paymentDataSource: IPaymentDataSource
  let gateway: PaymentGateway

  beforeEach(() => {
    paymentDataSource = {
      create: vi.fn().mockResolvedValue(undefined),
      findByOrderId: vi.fn(),
    }
    gateway = new PaymentGateway(paymentDataSource)
  })

  it('should call dataSource.create with mapped dto', async () => {
    const payment = new Payment('order-1', PaymentStatus.PENDING)
    await gateway.create(payment)
    expect(paymentDataSource.create).toHaveBeenCalledWith({
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
  })

  it('should return domain payment if found', async () => {
    const dto = {
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    paymentDataSource.findByOrderId = vi.fn().mockResolvedValue(dto)
    const result = await gateway.findByOrderId('order-1')
    expect(result).toEqual({ ...dto, domain: true })
  })

  it('should return null if payment not found', async () => {
    paymentDataSource.findByOrderId = vi.fn().mockResolvedValue(null)
    const result = await gateway.findByOrderId('order-x')
    expect(result).toBeNull()
  })
})
