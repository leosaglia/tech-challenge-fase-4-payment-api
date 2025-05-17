import { describe, it, expect, vi } from 'vitest'
import { RegisterPaymentUseCase } from './register-payment-use-case'
import { Payment } from '@core/enterprise/entities/payment'
import { PaymentStatus } from '@core/enterprise/enums/payment-status'
import { PaymentAlreadyExistsError } from '@core/enterprise/custom-exceptions/payment-already-exists'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'

const makePayment = (orderId = 'order-1'): Payment => {
  return new Payment(orderId, PaymentStatus.PAID)
}

describe('RegisterPaymentUseCase', () => {
  it('should register a new payment if not exists', async () => {
    const paymentGateway: IPaymentGateway = {
      findByOrderId: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    }
    const useCase = new RegisterPaymentUseCase(paymentGateway)
    const orderId = 'order-1'
    const result = await useCase.execute({ orderId })
    expect(result.payment).toBeInstanceOf(Payment)
    expect(paymentGateway.findByOrderId).toHaveBeenCalledWith(orderId)
    expect(paymentGateway.create).toHaveBeenCalledWith(result.payment)
    expect(result.payment.getOrderId()).toBe(orderId)
    expect(result.payment.getStatus()).toBe(PaymentStatus.PAID)
  })

  it('should throw PaymentAlreadyExistsError if payment exists', async () => {
    const paymentGateway: IPaymentGateway = {
      findByOrderId: vi.fn().mockResolvedValue(makePayment()),
      create: vi.fn(),
    }
    const useCase = new RegisterPaymentUseCase(paymentGateway)
    await expect(
      useCase.execute({ orderId: 'order-1' }),
    ).rejects.toBeInstanceOf(PaymentAlreadyExistsError)
    expect(paymentGateway.create).not.toHaveBeenCalled()
  })
})
