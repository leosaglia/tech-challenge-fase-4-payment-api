export class PaymentNotFoundError extends Error {
  constructor(message: string = 'Payment not found') {
    super(message)
    this.name = 'PaymentNotFoundError'
  }
}
