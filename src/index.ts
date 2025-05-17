import PrismaPaymentRepository from '@infra/database/postgress/prisma-payment-repository'
import { TechChallengeAPI } from '@infra/entrypoint/express/server'
import { PrismaService } from '@infra/database/prisma/prisma.service'
import { CreateOrderListener } from '@infra/entrypoint/sqs/consumer/create-order-listener'

const paymentDataSource = new PrismaPaymentRepository(new PrismaService())

TechChallengeAPI.start(paymentDataSource)

// Inicia o listener do SQS em paralelo
const orderListener = new CreateOrderListener(paymentDataSource)
orderListener.listen().catch((err) => {
  console.error('Erro ao iniciar o listener SQS:', err)
})
