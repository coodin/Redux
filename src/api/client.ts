// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

import { Dictionary } from "@reduxjs/toolkit"

type Params = {
  body: any
  config: number
  name: string
  headers: Dictionary<string>
  method: "GET"
}

type Config = {
  headers: {
    "Content-Type": string
  }
  config?: number | undefined
  name?: string | undefined
  method: string
  body?: string
}

export async function client(
  endpoint: any,
  { body, ...customConfig }: Partial<Params> = {},
) {
  const headers = { "Content-Type": "application/json" }

  const config: Config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(response.statusText)
  } catch (err) {
    if (err instanceof Error)
      return Promise.reject(err.message ? err.message : data)
  }
}

client.get = function (endpoint: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: "GET" })
}

client.post = function (endpoint: any, body: any, customConfig = {}) {
  return client(endpoint, { ...customConfig, body })
}
