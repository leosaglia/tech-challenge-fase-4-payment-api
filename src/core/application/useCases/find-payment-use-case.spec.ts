import { describe, it, expect, vi } from 'vitest'
import { FindByOrderIdUseCase } from './find-payment-use-case'
import { Payment } from '@core/enterprise/entities/payment'
import { PaymentNotFoundError } from '@core/enterprise/custom-exceptions/payment-not-found'
import { IPaymentGateway } from '@core/application/interfaces/gateway/payment-gateway-interface'

function makePayment(): Payment {
  return new Payment('order-id')
}

describe('FindByOrderIdUseCase', () => {
  it('should return payment when found', async () => {
    const payment = makePayment()
    const paymentGateway: IPaymentGateway = {
      findByOrderId: vi.fn().mockResolvedValue(payment),
      create: vi.fn(),
    }
    const useCase = new FindByOrderIdUseCase(paymentGateway)
    const result = await useCase.execute({ orderId: payment.getOrderId() })
    expect(result.payment).toBe(payment)
    expect(paymentGateway.findByOrderId).toHaveBeenCalledWith(
      payment.getOrderId(),
    )
  })

  it('should throw PaymentNotFoundError when payment not found', async () => {
    const paymentGateway: IPaymentGateway = {
      findByOrderId: vi.fn().mockResolvedValue(null),
      create: vi.fn(),
    }
    const useCase = new FindByOrderIdUseCase(paymentGateway)
    await expect(
      useCase.execute({ orderId: 'non-existent-order' }),
    ).rejects.toBeInstanceOf(PaymentNotFoundError)
  })
})
