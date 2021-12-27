import { json } from "remix";

export const badRequest = (data: object) => json(data, {status: 400})
