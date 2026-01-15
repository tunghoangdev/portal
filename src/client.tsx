import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { Await } from '@tanstack/react-router'
import { hydrateStart } from '@tanstack/react-start/client'
import { InnerApp } from './components/InnerApp'

const hydrationPromise = hydrateStart()

hydrateRoot(
  document,
  <StrictMode>
    <Await promise={hydrationPromise}>
      {(router) => <InnerApp router={router} />}
    </Await>
  </StrictMode>,
)
