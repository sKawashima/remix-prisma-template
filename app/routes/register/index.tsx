import { useEffect, useState } from 'react'
import {
  ActionFunction,
  Form,
  Link,
  useActionData,
  useSearchParams,
} from 'remix'
import { badRequest } from '~/utils/badRequest'
import { prisma } from '~/utils/prisma'
import { createUserSession, register } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  const username = formData.get('username')
  const password = formData.get('password')
  const redirectTo = formData.get('redirectTo') || '/'
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    typeof redirectTo !== 'string'
  ) {
    return badRequest({ error: `bad request` })
  }

  const userExist = await prisma.user.findFirst({
    where: {
      username,
    },
  })

  if (userExist) {
    return badRequest({ error: `User ${username} is already exists` })
  }

  const user = await register({ username, password })
  if (!user) {
    return badRequest({ error: 'DB save error' })
  }

  return createUserSession(user.id, redirectTo)
}

const validateUsername = (username: string) => {
  if (username.length < 4) return 'username must be at least 4 characters long'
  else return undefined
}

const validatePassword = (password: string) => {
  if (password.length < 8) return 'password must be at least 8 characters long'
  else return undefined
}

export default () => {
  const errors = useActionData()
  const [searchParams] = useSearchParams()
  const [usernameError, setUsernameError] = useState<string | undefined>()
  const [passwordError, setPasswordError] = useState<string | undefined>()

  useEffect(() => {
    if (errors) {
      console.error(errors)
    }
  }, [errors])

  return (
    <div>
      <h1>register</h1>
      <Form method="post">
        <div>
          <input
            type="text"
            name="username"
            placeholder="username"
            onChange={(event) => {
              setUsernameError(validateUsername(event.target.value))
            }}
          />
          {usernameError && usernameError}
        </div>
        <div>
          <input
            type="password"
            name="password"
            placeholder="password"
            onChange={(event) => {
              setPasswordError(validatePassword(event.target.value))
            }}
          />
          {passwordError && passwordError}
        </div>
        <input
          type="hidden"
          name="redirectTo"
          value={searchParams.get('redirectTo') ?? undefined}
        />
        <button type="submit">register</button>
      </Form>
    </div>
  )
}
