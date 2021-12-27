import bcrypt from 'bcrypt'
import { createCookieSessionStorage, redirect } from 'remix'
import { prisma } from './prisma'

const sessionSecret = process.env.SESSION_SECRET
if (!sessionSecret) {
  throw new Error('SESSION_SECRET must be set')
}

const storage = createCookieSessionStorage({
  cookie: {
    name: 'remix-prisma-template',
    secure: process.env.NODE_ENV === 'production',
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
})

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession()
  session.set('userId', userId)
  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await storage.commitSession(session),
    },
  })
}

export const getUserSession = (request: Request) => {
  return storage.getSession(request.headers.get('Cookie'))
}

export const getUserId = async (request: Request) => {
  const session = await getUserSession(request)
  const userId = session.get('userId')
  if (!userId || typeof userId !== 'string') return null
  return userId
}

export const getUser = async (request: Request) => {
  const userId = await getUserId(request)
  if (typeof userId !== 'string') return null

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    return user
  } catch {
    throw logout(request)
  }
}

type LoginForm = {
  username: string
  password: string
}

export const register = async ({ username, password }: LoginForm) => {
  const passwordHash = await bcrypt.hash(password, 10)
  return prisma.user.create({
    data: {
      username,
      passwordHash,
    },
  })
}

export const logout = async (request: Request) => {
  const session = await getUserSession(request)
  return redirect('/', {
    headers: {
      'Set-Cookie': await storage.destroySession(session),
    },
  })
}
