import { describe, it, expect, vi, beforeEach } from 'vitest'
import { CreateOrderListener } from './create-order-listener'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import SqsClient from '../config/sqs.config'
import { RegisterPaymentDto } from '@core/application/dtos/register-payment-use-case-dto'

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
  let sqsClient: SqsClient

  beforeEach(() => {
    dataSource = {} as IPaymentDataSource
    sqsClient = {
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    } as unknown as SqsClient
    listener = new CreateOrderListener(dataSource, sqsClient)
  })

  it('should process and delete messages received', async () => {
    const message: RegisterPaymentDto = {
      orderId: 'order-1',
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
    const message: RegisterPaymentDto = {
      orderId: 'order-2',
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
    const message: RegisterPaymentDto = {
      orderId: 'order-3',
    }
    const paymentController = (
      listener as unknown as { paymentController: PaymentControllerMock }
    ).paymentController
    paymentController.registerPayment.mockResolvedValueOnce(undefined)
    await (
      listener as unknown as {
        processMessage: (m: RegisterPaymentDto) => Promise<void>
      }
    ).processMessage.call(listener, message)
    expect(paymentController.registerPayment).toHaveBeenCalledWith(message)
  })
})
