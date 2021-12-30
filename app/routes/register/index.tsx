import { useEffect } from 'react'
import { ActionFunction, Form, useActionData, useSearchParams } from 'remix'
import { badRequest } from '~/utils/badRequest'
import { prisma } from '~/utils/prisma'
import { createUserSession, register } from '~/utils/session.server'

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData()

  console.log(formData)

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

export default () => {
  const errors = useActionData()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    if (errors) {
      console.error(errors)
    }
  }, [errors])

  return (
    <div>
      <h1>register</h1>
      <Form method="post">
        <input type="text" name="username" placeholder="username" />
        <input type="password" name="password" placeholder="password" />
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
