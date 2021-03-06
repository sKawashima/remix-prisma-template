import { ActionFunction, Link, LoaderFunction, useLoaderData } from 'remix'
import { getUser, logout } from '~/utils/session.server'

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request)

  const data = {
    user,
  }

  return data
}

export const action: ActionFunction = async ({ request }) => {
  return await logout(request)
}

export default function Index() {
  const data = useLoaderData()

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.4' }}>
      <h1>Welcome to Remix</h1>
      {data.user ? (
        <p>
          user: {data.user.username}{' '}
          <form action="/logout" method="post">
            <button type="submit">Logout</button>
          </form>
        </p>
      ) : (
        <p>
          not logined <Link to="/register">Register</Link>{' '}
          <Link to="/login">Login</Link>
        </p>
      )}
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
    </div>
  )
}
