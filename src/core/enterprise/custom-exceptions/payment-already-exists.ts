export class PaymentAlreadyExistsError extends Error {
  constructor(message: string = 'Payment already exists.') {
    super(message)
    this.name = 'PaymentAlreadyExistsError'
  }
}
