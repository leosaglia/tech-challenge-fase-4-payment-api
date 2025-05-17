import { describe, it, expect } from 'vitest'
import { PaymentPresenter } from './payment-presenter'
import { Payment } from '@core/enterprise/entities/payment'
import { PaymentStatus } from '@core/enterprise/enums/payment-status'

describe('PaymentPresenter', () => {
  it('should create a PaymentPresenter instance with correct values', () => {
    const presenter = new PaymentPresenter(
      '1',
      'order-1',
      'PENDING',
      new Date('2023-01-01'),
      new Date('2023-01-02'),
    )
    expect(presenter).toMatchObject({
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-02'),
    })
  })

  it('should present a Payment domain entity as PaymentPresenter', () => {
    const payment = new Payment(
      'order-2',
      PaymentStatus.PENDING,
      new Date('2023-02-01'),
      new Date('2023-02-02'),
      '2',
    )
    const presenter = PaymentPresenter.present(payment)
    expect(presenter).toBeInstanceOf(PaymentPresenter)
    expect(presenter).toMatchObject({
      id: '2',
      orderId: 'order-2',
      status: PaymentStatus.PENDING,
      createdAt: new Date('2023-02-01'),
      updatedAt: new Date('2023-02-02'),
    })
  })
})
