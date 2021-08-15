import * as dotenv from 'dotenv'
dotenv.config()
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { InternalServerErrorException } from '@nestjs/common'
import * as session from 'express-session'
import * as passport from 'passport'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule, {
      cors: true,
    })
    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUnitilialized: false,
        coockie: { maxAge: 3600000 },
      })
    )

    await app.listen(process.env.PORT || 3000)
  } catch {
    throw new InternalServerErrorException()
  }
}
bootstrap()
