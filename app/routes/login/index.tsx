import { useEffect, useState } from 'react'
import {
  ActionFunction,
  Form,
  Link,
  useActionData,
  useSearchParams,
} from 'remix'
import { badRequest } from '~/utils/badRequest'
import { createUserSession, login } from '~/utils/session.server'
import { validatePassword, validateUsername } from '~/utils/validateUser'

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

  const user = await login({ username, password })
  if (!user) return badRequest({ error: `username/password is incorrect` })

  return createUserSession(user.id, redirectTo)
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
        <button type="submit">login</button>
      </Form>
      or <Link to="/register">Register</Link>
    </div>
  )
}
