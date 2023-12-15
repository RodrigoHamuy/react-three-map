import { useEffect, useMemo } from 'react'
import { ScreenBlendEffect } from './screen-blend-effect'

export const ScreenBlend = () => {

  const effect = useMemo(() => new ScreenBlendEffect(), [])

  useEffect(() => {
    return () => {
      effect.dispose()
    }
  }, [effect])

  return <primitive object={effect} />
}