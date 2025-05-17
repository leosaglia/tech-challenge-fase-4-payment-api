import PrismaPaymentRepository from '@infra/database/postgress/prisma-payment-repository'
import { TechChallengeAPI } from '@infra/entrypoint/express/server'
import { PrismaService } from '@infra/database/prisma/prisma.service'

const paymentDataSource = new PrismaPaymentRepository(new PrismaService())

TechChallengeAPI.start(paymentDataSource)
