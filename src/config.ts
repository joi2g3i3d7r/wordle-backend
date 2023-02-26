import dotenv from 'dotenv';

dotenv.config()

export namespace Database {
  export const name = process.env.DATABASE_NAME
  export const username = process.env.DATABASE_USER
  export const password = process.env.DATABASE_PASSWORD
  export const host = process.env.DATABASE_HOST
  export const port = Number(process.env.DATABASE_PORT || 5432)
  export const poolMin = Number(process.env.DATABASE_POOL_MIN || '0')
  export const poolMax = Number(process.env.DATABASE_POOL_MAX || '10')
  export const poolIdle = Number(process.env.DATABASE_POOL_IDLE || '10000')
}

export namespace JsonWebToken {
  export const secretKey: string = process.env.JWT_SECRET || 'strongSecretKey'
}
