"use client"

import { RootDestructured } from '@/components/Effect/RootDestructured'
import { RootWildcard } from '@/components/Effect/RootWildcard'
import { SubpathDestructured } from '@/components/Effect/SubpathDestructured'
import { SubpathWildcard } from '@/components/Effect/SubpathWildcard'

export const Client = () => {
  return (
    <>
      <RootDestructured />
      <RootWildcard />
      <SubpathDestructured />
      <SubpathWildcard />
    </>
  )
}
