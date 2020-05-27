import { User } from "polyvolve-ui/lib/@types";

/**
 * This function assumes {} in the [body] and formats the name and surname accordingly.
 */
export function formatNameString(body: string, name: string, surname: string): string {
  return body.replace("{}", name + " " + surname)
}

export function formatNameStringUser(body: string, user: User): string {
  return formatNameString(body, user.name, user.surname)
}
