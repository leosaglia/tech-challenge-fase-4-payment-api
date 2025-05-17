import { describe, it, expect } from 'vitest'
import { PaymentMapper } from './payment-mapper'
import { Payment } from '@core/enterprise/entities/payment'
import { PaymentStatus } from '@core/enterprise/enums/payment-status'

describe('PaymentMapper', () => {
  it('should map PaymentDto to Payment domain entity', () => {
    const dto = {
      id: '1',
      orderId: 'order-1',
      status: PaymentStatus.PENDING,
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    }
    const payment = PaymentMapper.toDomain(dto)
    expect(payment.getId()).toBe('1')
    expect(payment.getOrderId()).toBe('order-1')
    expect(payment.getStatus()).toBe(PaymentStatus.PENDING)
    expect(payment.getCreatedAt()).toEqual(new Date('2023-01-01'))
    expect(payment.getUpdatedAt()).toEqual(new Date('2023-01-02'))
  })

  it('should map Payment domain entity to CreatePaymentDto', () => {
    const payment = new Payment(
      'order-2',
      PaymentStatus.PENDING,
      new Date('2023-02-01'),
      new Date('2023-02-02'),
      '2',
    )
    const dto = PaymentMapper.toCreatePaymentDto(payment)
    expect(dto).toEqual({
      id: '2',
      orderId: 'order-2',
      status: PaymentStatus.PENDING,
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-02'),
    })
  })
})
