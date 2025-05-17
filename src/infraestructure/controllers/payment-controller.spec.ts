import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PaymentController } from './payment-controller'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { PaymentPresenter } from '@infra/presenters/payment-presenter'
import SqsClient from '@infra/entrypoint/sqs/config/sqs.config'
import { RegisterPaymentDto } from '@core/application/dtos/register-payment-use-case-dto'

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
  let sqsClient: SqsClient
  let controller: PaymentController

  beforeEach(() => {
    paymentDataSource = {} as IPaymentDataSource
    sqsClient = { sendMessage: vi.fn() } as unknown as SqsClient
    controller = new PaymentController(paymentDataSource, sqsClient)
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
    const dto: RegisterPaymentDto = {
      orderId: 'order-2',
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
    expect(sqsClient.sendMessage).toHaveBeenCalledWith(
      process.env.PROCESSED_PAYMENT_QUEUE_URL ?? '',
      result,
    )
  })
})
