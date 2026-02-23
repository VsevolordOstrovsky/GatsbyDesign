import * as React from "react"
import * as THREE from "three"

const drawEarthTexture = () => {
  const canvas = document.createElement("canvas")
  canvas.width = 4096
  canvas.height = 2048
  const ctx = canvas.getContext("2d")

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const drawContinent = points => {
    ctx.beginPath()
    ctx.moveTo(points[0][0] * canvas.width, points[0][1] * canvas.height)
    for (let i = 1; i < points.length; i += 1) {
      ctx.lineTo(points[i][0] * canvas.width, points[i][1] * canvas.height)
    }
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
  }

  ctx.fillStyle = "rgba(70, 250, 255, 0.8)"
  ctx.strokeStyle = "rgba(185, 255, 255, 0.95)"
  ctx.lineJoin = "round"
  ctx.lineCap = "round"
  ctx.lineWidth = 5

  drawContinent([
    [0.12, 0.13],
    [0.21, 0.1],
    [0.27, 0.12],
    [0.31, 0.18],
    [0.28, 0.24],
    [0.22, 0.29],
    [0.16, 0.28],
    [0.11, 0.21],
  ])
  drawContinent([
    [0.2, 0.31],
    [0.25, 0.36],
    [0.27, 0.45],
    [0.26, 0.57],
    [0.23, 0.68],
    [0.2, 0.8],
    [0.15, 0.86],
    [0.12, 0.79],
    [0.14, 0.66],
    [0.16, 0.55],
    [0.17, 0.44],
  ])
  drawContinent([
    [0.39, 0.17],
    [0.5, 0.11],
    [0.65, 0.11],
    [0.78, 0.2],
    [0.9, 0.28],
    [0.88, 0.38],
    [0.8, 0.43],
    [0.71, 0.48],
    [0.61, 0.51],
    [0.51, 0.46],
    [0.48, 0.37],
    [0.44, 0.31],
    [0.4, 0.27],
  ])
  drawContinent([
    [0.49, 0.43],
    [0.56, 0.45],
    [0.59, 0.53],
    [0.58, 0.63],
    [0.55, 0.74],
    [0.5, 0.81],
    [0.45, 0.73],
    [0.44, 0.59],
    [0.46, 0.49],
  ])
  drawContinent([
    [0.79, 0.66],
    [0.84, 0.7],
    [0.83, 0.77],
    [0.78, 0.8],
    [0.73, 0.75],
    [0.74, 0.68],
  ])
  drawContinent([
    [0.33, 0.08],
    [0.38, 0.07],
    [0.41, 0.11],
    [0.37, 0.15],
    [0.32, 0.14],
  ])

  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.needsUpdate = true
  return texture
}

const createGlowSpriteTexture = () => {
  const canvas = document.createElement("canvas")
  canvas.width = 512
  canvas.height = 512
  const ctx = canvas.getContext("2d")
  const gradient = ctx.createRadialGradient(256, 256, 8, 256, 256, 250)
  gradient.addColorStop(0, "rgba(120, 255, 255, 0.85)")
  gradient.addColorStop(0.35, "rgba(30, 190, 255, 0.45)")
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 512, 512)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

const createLatLongLines = radius => {
  const points = []
  const latSteps = 16
  const lonSteps = 24
  const lonSegments = 120
  const latSegments = 120

  for (let i = 1; i < latSteps; i += 1) {
    const theta = (i / latSteps) * Math.PI
    const y = radius * Math.cos(theta)
    const ring = radius * Math.sin(theta)
    for (let j = 0; j < lonSegments; j += 1) {
      const a0 = (j / lonSegments) * Math.PI * 2
      const a1 = ((j + 1) / lonSegments) * Math.PI * 2
      points.push(
        ring * Math.cos(a0),
        y,
        ring * Math.sin(a0),
        ring * Math.cos(a1),
        y,
        ring * Math.sin(a1)
      )
    }
  }

  for (let i = 0; i < lonSteps; i += 1) {
    const phi = (i / lonSteps) * Math.PI * 2
    for (let j = 0; j < latSegments; j += 1) {
      const t0 = (j / latSegments) * Math.PI
      const t1 = ((j + 1) / latSegments) * Math.PI
      points.push(
        radius * Math.sin(t0) * Math.cos(phi),
        radius * Math.cos(t0),
        radius * Math.sin(t0) * Math.sin(phi),
        radius * Math.sin(t1) * Math.cos(phi),
        radius * Math.cos(t1),
        radius * Math.sin(t1) * Math.sin(phi)
      )
    }
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3))
  return geometry
}

const HologramGlobe = () => {
  const mountRef = React.useRef(null)

  React.useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, -0.12, 4.75)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    mount.appendChild(renderer.domElement)

    const globeGroup = new THREE.Group()
    globeGroup.scale.setScalar(0.93)
    scene.add(globeGroup)

    const sphereGeometry = new THREE.SphereGeometry(1.28, 86, 86)
    const earthTexture = drawEarthTexture()
    const earthMaterial = new THREE.MeshBasicMaterial({
      map: earthTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    })
    const earth = new THREE.Mesh(sphereGeometry, earthMaterial)
    globeGroup.add(earth)

    const gridMaterial = new THREE.LineBasicMaterial({
      color: "#5aefff",
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    })
    const gridLines = new THREE.LineSegments(createLatLongLines(1.31), gridMaterial)
    globeGroup.add(gridLines)

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: "#42beff",
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    })
    const glowSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.43, 56, 56),
      glowMaterial
    )
    globeGroup.add(glowSphere)

    const pointsMaterial = new THREE.PointsMaterial({
      color: "#8bc1ff",
      size: 0.013,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    })
    const points = new THREE.Points(
      new THREE.SphereGeometry(1.34, 56, 56),
      pointsMaterial
    )
    globeGroup.add(points)

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: "#3f83ff",
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
    const ringOne = new THREE.Mesh(
      new THREE.RingGeometry(1.5, 1.54, 128),
      ringMaterial
    )
    ringOne.rotation.x = Math.PI / 2.6
    scene.add(ringOne)

    const ringTwo = new THREE.Mesh(
      new THREE.RingGeometry(1.85, 1.89, 128),
      ringMaterial.clone()
    )
    ringTwo.material.opacity = 0.2
    ringTwo.rotation.x = Math.PI / 2.2
    ringTwo.rotation.y = Math.PI / 5
    scene.add(ringTwo)

    const glowTexture = createGlowSpriteTexture()
    const underGlow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTexture,
        color: "#43bcff",
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    underGlow.scale.set(3.3, 1.35, 1)
    underGlow.position.set(0, -1.85, 0)
    scene.add(underGlow)

    const resize = () => {
      const width = mount.clientWidth
      const height = mount.clientHeight
      camera.aspect = width / Math.max(height, 1)
      camera.updateProjectionMatrix()
      renderer.setSize(width, height, false)
    }

    resize()
    window.addEventListener("resize", resize)

    const clock = new THREE.Clock()
    let rafId = 0

    const animate = () => {
      const t = clock.getElapsedTime()

      globeGroup.rotation.y = t * 0.24
      globeGroup.rotation.x = Math.sin(t * 0.35) * 0.12
      ringOne.rotation.z = t * 0.18
      ringTwo.rotation.z = -t * 0.12

      earthMaterial.opacity = 0.6 + (Math.sin(t * 1.45) + 1) * 0.06
      gridMaterial.opacity = 0.36 + (Math.sin(t * 1.7) + 1) * 0.08
      pointsMaterial.opacity = 0.36 + (Math.sin(t * 2.1) + 1) * 0.08
      underGlow.material.opacity = 0.44 + (Math.sin(t * 1.8) + 1) * 0.08

      renderer.render(scene, camera)
      rafId = window.requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      sphereGeometry.dispose()
      earthTexture.dispose()
      earthMaterial.dispose()
      gridLines.geometry.dispose()
      gridMaterial.dispose()
      glowSphere.geometry.dispose()
      glowMaterial.dispose()
      points.geometry.dispose()
      pointsMaterial.dispose()
      glowTexture.dispose()
      underGlow.material.dispose()
      ringOne.geometry.dispose()
      ringOne.material.dispose()
      ringTwo.geometry.dispose()
      ringTwo.material.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
    }
  }, [])

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
}

export default HologramGlobe
