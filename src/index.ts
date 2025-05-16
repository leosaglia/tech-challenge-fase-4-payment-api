import PrismaPaymentRepository from '@infra/database/postgress/prisma-payment-repository'
import { TechChallengeAPI } from '@infra/frameworks/express/server'
import { PrismaService } from '@infra/frameworks/prisma/prisma.service'

const paymentDataSource = new PrismaPaymentRepository(new PrismaService())

TechChallengeAPI.start(paymentDataSource)
