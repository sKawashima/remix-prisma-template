export const validateUsername = (username: string) => {
  if (username.length < 4) return 'username must be at least 4 characters long'
  else return undefined
}

export const validatePassword = (password: string) => {
  if (password.length < 8) return 'password must be at least 8 characters long'
  else return undefined
}
