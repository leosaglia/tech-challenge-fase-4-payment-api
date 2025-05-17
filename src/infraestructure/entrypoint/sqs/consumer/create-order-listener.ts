import SqsClient from '../config/sqs.config'
import { PaymentController } from '@infra/controllers/payment-controller'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'
import { RegisterPaymentDto } from '@core/application/dtos/register-payment-use-case-dto'

export class CreateOrderListener {
  private readonly queueUrl: string
  private readonly sqsClient: SqsClient
  private readonly paymentController: PaymentController

  constructor(dataSource: IPaymentDataSource, sqsClient: SqsClient) {
    this.queueUrl = process.env.CREATE_ORDER_QUEUE_URL ?? ''
    this.sqsClient = sqsClient
    this.paymentController = new PaymentController(dataSource, sqsClient)
  }

  async listen(): Promise<void> {
    while (true) {
      try {
        await this.receiveMessages()
        // aguardar um tempo antes de verificar novamente
        await new Promise((resolve) => setTimeout(resolve, 10000))
      } catch (error) {
        console.error('Error receiving messages:', error)
      }
    }
  }

  private async receiveMessages(): Promise<void> {
    const messages = await this.sqsClient.receiveMessages<RegisterPaymentDto>(
      this.queueUrl,
    )

    for (const { message, receiptHandles } of messages) {
      console.log('Received message:', message)

      try {
        await this.processMessage(message)
        await this.sqsClient.deleteMessage(this.queueUrl, receiptHandles)
      } catch (error) {
        console.error('Error processing message:', error)
      }
    }
  }

  private async processMessage(message: RegisterPaymentDto): Promise<void> {
    console.log('Processing message:', message)
    message.orderId = message.orderId.toString()
    await this.paymentController.registerPayment(message)
  }
}
