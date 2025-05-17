import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PaymentController } from './payment-controller'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PaymentPresenter } from '@infra/presenters/payment-presenter'
import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'

// Mocks
// vi.mock('@infra/gateway/payment-gateway', () => ({
//   PaymentGateway: vi.fn().mockImplementation(() => ({})),
// }))
vi.mock('@core/application/useCases/find-payment-use-case', () => ({
  FindByOrderIdUseCase: vi.fn().mockImplementation(() => ({
    execute: vi
      .fn()
      .mockResolvedValue({ payment: { id: '1', orderId: 'order-1' } }),
  })),
}))
vi.mock('@core/application/useCases/register-payment-use-case', () => ({
  RegisterPaymentUseCase: vi.fn().mockImplementation(() => ({
    execute: vi
      .fn()
      .mockResolvedValue({ payment: { id: '2', orderId: 'order-2' } }),
  })),
}))

vi.mock('@infra/presenters/payment-presenter', () => ({
  PaymentPresenter: {
    present: vi.fn((payment) => ({ ...payment, presented: true })),
  },
}))

describe('PaymentController', () => {
  let paymentDataSource: IPaymentDataSource
  let controller: PaymentController

  beforeEach(() => {
    paymentDataSource = {} as IPaymentDataSource
    controller = new PaymentController(paymentDataSource)
  })

  it('should find payment by order id', async () => {
    const result = await controller.findByOrderId('order-1')
    expect(result).toEqual({
      id: '1',
      orderId: 'order-1',
      presented: true,
    })
    expect(PaymentPresenter.present).toHaveBeenCalledWith({
      id: '1',
      orderId: 'order-1',
    })
  })

  it('should register a payment', async () => {
    const dto: CreatePaymentDto = {
      id: '2',
      orderId: 'order-2',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const result = await controller.registerPayment(dto)
    expect(result).toEqual({
      id: '2',
      orderId: 'order-2',
      presented: true,
    })
    expect(PaymentPresenter.present).toHaveBeenCalledWith({
      id: '2',
      orderId: 'order-2',
    })
  })
})
