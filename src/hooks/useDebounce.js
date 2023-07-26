// https://www.youtube.com/watch?v=0c6znExIqRw&t=594s

import { useEffect } from "react"
import useTimeout from "./useTimeout"

export default function useDebounce(callback, delay, dependencies) {
  const { reset, clear } = useTimeout(callback, delay)
  useEffect(reset, [...dependencies, reset])
  useEffect(clear, [])
}