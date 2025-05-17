import SqsClient from '../config/sqs.config'
import { CreatePaymentDto } from '@core/application/dtos/create-payment-dto'
import { PaymentController } from '@infra/controllers/payment-controller'
import { IPaymentDataSource } from '@core/application/interfaces/repository/payment-data-source'

export class CreateOrderListener {
  private readonly queueUrl: string
  private readonly sqsClient: SqsClient
  private readonly paymentController: PaymentController

  constructor(dataSource: IPaymentDataSource) {
    this.queueUrl = process.env.SQS_QUEUE_URL ?? ''
    this.sqsClient = new SqsClient()
    this.paymentController = new PaymentController(dataSource)
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
    const messages = await this.sqsClient.receiveMessages<CreatePaymentDto>(
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

  private async processMessage(message: CreatePaymentDto): Promise<void> {
    console.log('Processing message:', message)
    await this.paymentController.registerPayment(message)
  }
}
