import * as React from "react"
import * as THREE from "three"

const COMET_COUNT = 70

const CometBackground = () => {
  const mountRef = React.useRef(null)

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10)
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const positions = new Float32Array(COMET_COUNT * 2 * 3)
    const speeds = new Float32Array(COMET_COUNT)
    const lengths = new Float32Array(COMET_COUNT)

    const resetComet = index => {
      const base = index * 6
      const x = Math.random() * 2.6 - 0.8
      const y = Math.random() * 2.4 - 0.2
      const z = Math.random() * 0.4 - 0.2
      const length = 0.06 + Math.random() * 0.12

      lengths[index] = length
      speeds[index] = 0.0025 + Math.random() * 0.005

      positions[base] = x
      positions[base + 1] = y
      positions[base + 2] = z

      positions[base + 3] = x + length
      positions[base + 4] = y + length * 0.55
      positions[base + 5] = z
    }

    for (let i = 0; i < COMET_COUNT; i += 1) {
      resetComet(i)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))

    const material = new THREE.LineBasicMaterial({
      color: new THREE.Color("#2e7dff"),
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })

    const comets = new THREE.LineSegments(geometry, material)
    scene.add(comets)

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      renderer.setSize(width, height, false)
    }

    resize()
    window.addEventListener("resize", resize)

    let rafId = 0
    const animate = () => {
      for (let i = 0; i < COMET_COUNT; i += 1) {
        const base = i * 6
        const speed = speeds[i]
        const length = lengths[i]

        const nextX = positions[base] - speed
        const nextY = positions[base + 1] - speed * 0.55

        positions[base] = nextX
        positions[base + 1] = nextY

        positions[base + 3] = nextX + length
        positions[base + 4] = nextY + length * 0.55

        if (nextX < -1.5 || nextY < -1.3) {
          resetComet(i)
        }
      }

      geometry.attributes.position.needsUpdate = true
      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />
}

export default CometBackground
