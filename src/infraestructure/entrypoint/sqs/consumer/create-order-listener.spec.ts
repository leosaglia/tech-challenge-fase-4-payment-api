import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateOrderListener } from './create-order-listener'
import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'

vi.mock('../config/sqs.config', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    })),
  }
})

vi.mock('@infra/controllers/payment-controller', () => {
  return {
    PaymentController: vi.fn().mockImplementation(() => ({
      registerPayment: vi.fn(),
    })),
  }
})

type SqsClientMock = {
  receiveMessages: ReturnType<typeof vi.fn>
  deleteMessage: ReturnType<typeof vi.fn>
}
type PaymentControllerMock = {
  registerPayment: ReturnType<typeof vi.fn>
}

describe('CreateOrderListener', () => {
  let listener: CreateOrderListener
  let dataSource: IPaymentDataSource

  beforeEach(() => {
    dataSource = {} as IPaymentDataSource
    listener = new CreateOrderListener(dataSource)
  })

  it('should process and delete messages received', async () => {
    const message: CreatePaymentDto = {
      id: '1',
      orderId: 'order-1',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const sqsClient = (listener as unknown as { sqsClient: SqsClientMock })
      .sqsClient
    const paymentController = (
      listener as unknown as { paymentController: PaymentControllerMock }
    ).paymentController
    sqsClient.receiveMessages.mockResolvedValueOnce([
      { message, receiptHandles: 'abc' },
    ])
    paymentController.registerPayment.mockResolvedValueOnce(undefined)
    sqsClient.deleteMessage.mockResolvedValueOnce(undefined)

    await (
      listener as unknown as { receiveMessages: () => Promise<void> }
    ).receiveMessages.call(listener)
    expect(paymentController.registerPayment).toHaveBeenCalledWith(message)
  })

  it('should handle error in processMessage and not throw', async () => {
    const message: CreatePaymentDto = {
      id: '2',
      orderId: 'order-2',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const sqsClient = (listener as unknown as { sqsClient: SqsClientMock })
      .sqsClient
    const paymentController = (
      listener as unknown as { paymentController: PaymentControllerMock }
    ).paymentController
    sqsClient.receiveMessages.mockResolvedValueOnce([
      { message, receiptHandles: 'def' },
    ])
    paymentController.registerPayment.mockRejectedValueOnce(new Error('fail'))
    sqsClient.deleteMessage.mockResolvedValueOnce(undefined)

    await (
      listener as unknown as { receiveMessages: () => Promise<void> }
    ).receiveMessages.call(listener)
    expect(paymentController.registerPayment).toHaveBeenCalledWith(message)
    expect(sqsClient.deleteMessage).not.toHaveBeenCalled()
  })

  it('should call registerPayment in processMessage', async () => {
    const message: CreatePaymentDto = {
      id: '3',
      orderId: 'order-3',
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    const paymentController = (
      listener as unknown as { paymentController: PaymentControllerMock }
    ).paymentController
    paymentController.registerPayment.mockResolvedValueOnce(undefined)
    await (
      listener as unknown as {
        processMessage: (m: CreatePaymentDto) => Promise<void>
      }
    ).processMessage.call(listener, message)
    expect(paymentController.registerPayment).toHaveBeenCalledWith(message)
  })
})
