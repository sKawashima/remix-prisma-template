import bcrypt from 'bcrypt'
import { prisma } from './prisma'

type LoginForm = {
  username: string,
  password: string
}

export const register = async ({username, password}:LoginForm) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      username,
      passwordHash
    }
  })
}
