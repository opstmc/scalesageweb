import { useEffect, useRef, MutableRefObject } from 'react'
import * as THREE from 'three'
import type { GlobeState } from '@/hooks/useGlobeScroll'

export function GlobeCanvas({ stateRef }: { stateRef: MutableRefObject<GlobeState> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.5

    const scene = new THREE.Scene()
    const cam = new THREE.PerspectiveCamera(38, window.innerWidth / window.innerHeight, .01, 100)
    cam.position.set(0, 0, 4.0)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const envScene = new THREE.Scene()
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(50, 32, 32),
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        vertexShader: `varying vec3 vD;void main(){vD=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
        fragmentShader: `varying vec3 vD;void main(){float y=vD.y,x=vD.x,z=vD.z;vec3 top=vec3(.90,.95,1.);vec3 mid=vec3(.08,.22,.80);vec3 bot=vec3(.005,.008,.03);vec3 col=y>0.?mix(mid,top,pow(y,.55)):mix(mid,bot,pow(-y,.4));col=mix(col,vec3(.05,.30,1.),smoothstep(.25,1.,x)*smoothstep(-.35,.35,1.-abs(y))*.7);col=mix(col,vec3(.95,.98,1.),smoothstep(.4,1.,-x+z*.5)*smoothstep(.1,.7,y)*.6);gl_FragColor=vec4(col,1.);}`
      })
    ))
    const envMap = pmrem.fromScene(envScene).texture
    scene.environment = envMap
    pmrem.dispose()

    const R = 1.42

    const tc = document.createElement('canvas')
    tc.width = tc.height = 2048
    const gx = tc.getContext('2d')!
    const bgGrad = gx.createRadialGradient(1024, 900, 100, 1024, 1024, 1024)
    bgGrad.addColorStop(0, '#0a1835')
    bgGrad.addColorStop(.5, '#060f25')
    bgGrad.addColorStop(1, '#02070f')
    gx.fillStyle = bgGrad
    gx.fillRect(0, 0, 2048, 2048)
    gx.strokeStyle = 'rgba(40,110,255,.22)'
    gx.lineWidth = 1.2
    for (let i = 0; i <= 24; i++) { const y = i/24*2048; gx.beginPath(); gx.moveTo(0,y); gx.lineTo(2048,y); gx.stroke() }
    for (let i = 0; i <= 32; i++) { const x = i/32*2048; gx.beginPath(); gx.moveTo(x,0); gx.lineTo(x,2048); gx.stroke() }

    const globeMat = new THREE.MeshStandardMaterial({
      map: new THREE.CanvasTexture(tc),
      roughness: .08, metalness: .3, envMap, envMapIntensity: 1.4, color: 0x050c1e
    })
    const globe = new THREE.Mesh(new THREE.SphereGeometry(R, 96, 96), globeMat)

    function sPt(u: number, r: number) {
      const phi = (25 + 130*u) * Math.PI/180
      const theta = (55 * Math.cos(Math.PI*u)) * Math.PI/180
      return new THREE.Vector3(r*Math.sin(phi)*Math.cos(theta), r*Math.cos(phi), r*Math.sin(phi)*Math.sin(theta))
    }
    function mkTube(r: number, tr: number, col: number, rgh: number, met: number) {
      const pts: THREE.Vector3[] = []
      for (let i=0;i<=300;i++) pts.push(sPt(i/300, r))
      const geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts, false, 'catmullrom', .5), 300, tr, 20, false)
      return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: col, roughness: rgh, metalness: met, envMap, envMapIntensity: 2.0, transparent: true, opacity: 0 }))
    }

    const sBlue = mkTube(R+.042,.115,0x0E55DD,.12,.85)
    const sSilver = mkTube(R+.055,.072,0xC8D4E8,.04,1.0)
    const sEdge = mkTube(R+.075,.026,0x44CCFF,.05,.8)

    const rim = new THREE.Mesh(
      new THREE.TorusGeometry(R+.048, .055, 32, 200),
      new THREE.MeshStandardMaterial({ color: 0x0066FF, roughness: .06, metalness: .9, envMap, envMapIntensity: 2.2, transparent: true, opacity: 0 })
    )
    rim.rotation.x = Math.PI * .06

    const rimGlow = new THREE.Mesh(
      new THREE.TorusGeometry(R+.052, .018, 16, 200),
      new THREE.MeshBasicMaterial({ color: 0x44AAFF, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false })
    )
    rimGlow.rotation.x = Math.PI * .06

    const atm = new THREE.Mesh(
      new THREE.SphereGeometry(R*1.1, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x0033AA, transparent: true, opacity: .15, side: THREE.BackSide, blending: THREE.AdditiveBlending, depthWrite: false })
    )

    const group = new THREE.Group()
    group.add(atm, globe, sBlue, sSilver, sEdge, rim, rimGlow)
    scene.add(group)

    const key = new THREE.DirectionalLight(0xCCDDFF, 4.0)
    key.position.set(-2.8, 3.2, 2.5)
    scene.add(key)
    const fill = new THREE.DirectionalLight(0x2255FF, 3.0)
    fill.position.set(3.5, .5, .5)
    scene.add(fill)
    const top = new THREE.DirectionalLight(0xFFFFFF, .8)
    top.position.set(0, 4, 0)
    scene.add(top)

    const clock = new THREE.Clock()
    let autoY = 0
    let animId: number

    function renderLoop() {
      animId = requestAnimationFrame(renderLoop)
      autoY += .0008
      const S = stateRef.current
      group.position.set(S.posX, S.posY, S.posZ)
      group.scale.setScalar(S.scale)
      group.rotation.y = autoY + S.rotY
      group.rotation.x = S.rotX
      const quiet = S.scale < 0.7 ? 0.3 : 1
      const go = S.globeOpacity * quiet
      ;(sBlue.material as THREE.MeshStandardMaterial).opacity = S.sBlueOpacity * go
      ;(sSilver.material as THREE.MeshStandardMaterial).opacity = S.sSilverOpacity * go
      ;(sEdge.material as THREE.MeshStandardMaterial).opacity = S.sEdgeOpacity * go
      ;(rim.material as THREE.MeshStandardMaterial).opacity = S.rimOpacity * go
      ;(rimGlow.material as THREE.MeshBasicMaterial).opacity = S.rimOpacity * .48 * go
      ;(atm.material as THREE.MeshBasicMaterial).opacity = S.atmOpacity * go
      ;(globeMat as THREE.MeshStandardMaterial).transparent = true
      ;(globeMat as THREE.MeshStandardMaterial).opacity = go
      key.position.set(-2.8, 3.2, 2.5)
      cam.position.set(S.camX, S.camY, S.camZ)
      cam.lookAt(S.posX*.3, 0, 0)
      renderer.render(scene, cam)
    }
    renderLoop()

    const onResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      cam.aspect = window.innerWidth / window.innerHeight
      cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [stateRef])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 2 }}
    />
  )
}
