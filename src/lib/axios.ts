import realAxios, { AxiosError } from "axios"

export const axios = realAxios.create({
  headers: {
    "Content-Type": "application/json",
  }
})

export const defaultHeaders = {
  "Content-Type": "application/json",
}

export function authenticatedHeader(hash: string) {
  if (!hash) {
    return {}
  }

  return { "App-Hash": `${hash}` }
}

export function getErrorMessage(err: AxiosError): string {
  if (err.response) {
    if (err.response.data.message) {
      return err.response.data.message
    }
  }
  return err.message
}
