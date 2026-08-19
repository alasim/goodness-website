import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { buildOS } from '../data/os'
import type { OSModel } from '../data/os'
import { loadDataset } from '../data/source'
import { readOverlay } from '../data/local'

/**
 * The whole product reads from here.
 *
 * `tick` starts at 0 so the server-rendered markup and the first client render agree; once the
 * component is mounted the browser overlay (or a mutation) bumps it and the model rebuilds.
 */
export function useOS(): {
  os: OSModel | null
  isLoading: boolean
  error: Error | null
} {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const bump = () => setTick((t) => t + 1)
    bump()
    window.addEventListener('gs-os-overlay-changed', bump)
    return () => window.removeEventListener('gs-os-overlay-changed', bump)
  }, [])

  const query = useQuery({
    queryKey: ['os', tick],
    queryFn: async () => buildOS(await loadDataset({ withOverlay: tick > 0 })),
    staleTime: Infinity,
  })

  return {
    os: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  }
}

/** Sign-in-lite identity on the local driver: the profile the visitor claimed. */
export function useClaimedProfileSlug(): string | null {
  const [slug, setSlug] = useState<string | null>(null)
  useEffect(() => {
    const read = () => setSlug(readOverlay().me)
    read()
    window.addEventListener('gs-os-overlay-changed', read)
    return () => window.removeEventListener('gs-os-overlay-changed', read)
  }, [])
  return slug
}

export function useClaimedPartnerId(): string | null {
  const [partner, setPartner] = useState<string | null>(null)
  useEffect(() => {
    const read = () => setPartner(readOverlay().partner)
    read()
    window.addEventListener('gs-os-overlay-changed', read)
    return () => window.removeEventListener('gs-os-overlay-changed', read)
  }, [])
  return partner
}

export function useClaimedChapterId(): string | null {
  const [chapter, setChapter] = useState<string | null>(null)
  useEffect(() => {
    const read = () => setChapter(readOverlay().chapterLead)
    read()
    window.addEventListener('gs-os-overlay-changed', read)
    return () => window.removeEventListener('gs-os-overlay-changed', read)
  }, [])
  return chapter
}
