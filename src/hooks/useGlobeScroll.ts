import { useEffect, MutableRefObject } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface GlobeState {
  posX: number; posY: number; posZ: number
  rotY: number; rotX: number; scale: number
  camZ: number; camX: number; camY: number
  sBlueOpacity: number; sSilverOpacity: number; sEdgeOpacity: number
  rimOpacity: number; atmOpacity: number
  globeOpacity: number
}

export function useGlobeScroll(stateRef: MutableRefObject<GlobeState>) {
  useEffect(() => {
    const chapters = [
      { posX: 2.2,  posY: 0,   scale: 1,    camZ: 4.0, camX: 0,    camY: 0,   rotY: 0,    rotX: 0.10, sBlueOpacity: 0, sSilverOpacity: 0, sEdgeOpacity: 0, rimOpacity: 0, atmOpacity: 0.15, globeOpacity: 1.0 },
      { posX: 2.0,  posY: .1,  scale: 1.12, camZ: 3.6, camX: .2,   camY: 0,   rotY: .85,  rotX: 0.08, sBlueOpacity: 1, sSilverOpacity: 0, sEdgeOpacity: 0, rimOpacity: 0, atmOpacity: 0.18, globeOpacity: 1.0 },
      { posX: -2.1, posY: 0,   scale: .93,  camZ: 4.2, camX: -.2,  camY: .1,  rotY: 2.15, rotX: -0.05, sBlueOpacity: 1, sSilverOpacity: 1, sEdgeOpacity: 0, rimOpacity: 0, atmOpacity: 0.20, globeOpacity: 1.0 },
      { posX: 1.9,  posY: -.1, scale: 1.18, camZ: 3.3, camX: .22,  camY: -.1, rotY: 3.7,  rotX: 0.07, sBlueOpacity: 1, sSilverOpacity: 1, sEdgeOpacity: 1, rimOpacity: 0, atmOpacity: 0.22, globeOpacity: 1.0 },
      { posX: -1.9, posY: 0,   scale: .9,   camZ: 4.4, camX: -.2,  camY: .08, rotY: 4.4,  rotX: -0.03, sBlueOpacity: 1, sSilverOpacity: 1, sEdgeOpacity: 1, rimOpacity: 1, atmOpacity: 0.22, globeOpacity: 0.4 },
      { posX: -2.0, posY: .1,  scale: .88,  camZ: 4.3, camX: -.22, camY: .14, rotY: 5.1,  rotX: -0.04, sBlueOpacity: 1, sSilverOpacity: 1, sEdgeOpacity: 1, rimOpacity: 1, atmOpacity: 0.22, globeOpacity: 0.4 },
      { posX: -2.1, posY: .05, scale: .85,  camZ: 4.4, camX: -.24, camY: .12, rotY: 5.5,  rotX: -0.02, sBlueOpacity: 1, sSilverOpacity: 1, sEdgeOpacity: 1, rimOpacity: 1, atmOpacity: 0.20, globeOpacity: 0.4 },
      { posX: 0,    posY: 0,   scale: 1.35, camZ: 3.0, camX: 0,    camY: 0,   rotY: 6.5,  rotX: 0.10, sBlueOpacity: 1, sSilverOpacity: 1, sEdgeOpacity: 1, rimOpacity: 1, atmOpacity: 0.25, globeOpacity: 1.0 },
      { posX: 0,    posY: .5,  scale: .5,   camZ: 5.5, camX: 0,    camY: .2,  rotY: 7.2,  rotX: 0, sBlueOpacity: 1, sSilverOpacity: 1, sEdgeOpacity: 1, rimOpacity: 1, atmOpacity: 0.15, globeOpacity: 1.0 },
    ]


    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#pin-wrap',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 3.5,
      }
    })

    chapters.forEach((ch, i) => {
      tl.to(stateRef.current, { ...ch, duration: 1, ease: 'power2.inOut' }, i)
    })

    const triggers: ScrollTrigger[] = []

    for (let i = 0; i < 9; i++) {
      const el = document.querySelector(`#ch${i} .ch-content`)
      if (!el) continue

      const t1 = gsap.fromTo(el,
        { opacity: 0, y: 48 },
        {
          opacity: 1, y: 0, ease: 'power2.out',
          scrollTrigger: {
            trigger: '#pin-wrap',
            start: `${(i/9*100).toFixed(1)}% top`,
            end: `${((i+.38)/9*100).toFixed(1)}% top`,
            scrub: 1.4,
          }
        }
      )
      const t2 = gsap.fromTo(el,
        { opacity: 1, y: 0 },
        {
          opacity: 0, y: -36, ease: 'power2.in',
          scrollTrigger: {
            trigger: '#pin-wrap',
            start: `${((i+.62)/9*100).toFixed(1)}% top`,
            end: `${((i+1)/9*100).toFixed(1)}% top`,
            scrub: 1.4,
          }
        }
      )
      if (t1.scrollTrigger) triggers.push(t1.scrollTrigger)
      if (t2.scrollTrigger) triggers.push(t2.scrollTrigger)
    }

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()
      triggers.forEach(t => t.kill())
    }
  }, [stateRef])
}
