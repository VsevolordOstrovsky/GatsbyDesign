import React, { useEffect, useRef } from "react"

const WorkingCube = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const cubeRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const starsRef = useRef(null)
  const nearStarsRef = useRef(null)

  useEffect(() => {
    import("three")
      .then(THREE => {
        if (!canvasRef.current) return

        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x0a0a1a)
        sceneRef.current = scene

        const aspect = window.innerWidth / window.innerHeight
        const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000)
        camera.position.set(6, 2.5, 12)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({
          canvas: canvasRef.current,
          antialias: true,
        })
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = false
        rendererRef.current = renderer

        function createRoundedCube(size, radius, smoothness) {
          const shape = new THREE.Shape()

          shape.moveTo(-size / 2 + radius, -size / 2)
          shape.lineTo(size / 2 - radius, -size / 2)
          shape.quadraticCurveTo(size / 2, -size / 2, size / 2, -size / 2 + radius)
          shape.lineTo(size / 2, size / 2 - radius)
          shape.quadraticCurveTo(size / 2, size / 2, size / 2 - radius, size / 2)
          shape.lineTo(-size / 2 + radius, size / 2)
          shape.quadraticCurveTo(-size / 2, size / 2, -size / 2, size / 2 - radius)
          shape.lineTo(-size / 2, -size / 2 + radius)
          shape.quadraticCurveTo(-size / 2, -size / 2, -size / 2 + radius, -size / 2)

          const extrudeSettings = {
            steps: 1,
            depth: size,
            bevelEnabled: true,
            bevelThickness: radius * 0.8,
            bevelSize: radius * 0.8,
            bevelOffset: 0,
            bevelSegments: smoothness,
          }

          const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
          geometry.center()
          geometry.rotateX(Math.PI / 2)

          return geometry
        }

        const size = 2.8
        const radius = 0.4
        const smoothness = 12

        const geometry = createRoundedCube(size, radius, smoothness)
        const material = new THREE.MeshStandardMaterial({
          color: 0xffffff,
          emissive: 0x222222,
          roughness: 0.2,
          metalness: 0.1,
          emissiveIntensity: 0.4,
          flatShading: false,
          side: THREE.DoubleSide,
        })

        const cube = new THREE.Mesh(geometry, material)

        const updateCubePosition = () => {
          if (!cubeRef.current) return

          const targetPercent = 0.75
          const currentAspect = window.innerWidth / window.innerHeight
          const baseWidth = 20
          const visibleWidth = baseWidth * (currentAspect / 1.5)
          const leftEdge = -visibleWidth / 2
          const positionX = leftEdge + visibleWidth * targetPercent
          cubeRef.current.position.x = positionX
        }

        updateCubePosition()
        cube.rotation.x = 0.2
        cubeRef.current = cube
        scene.add(cube)

        const edges = new THREE.EdgesGeometry(geometry)
        const line = new THREE.LineSegments(
          edges,
          new THREE.LineBasicMaterial({ color: 0xaaccff })
        )
        cube.add(line)

        scene.add(new THREE.AmbientLight(0x404060))

        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
        mainLight.position.set(3, 5, 5)
        scene.add(mainLight)

        const rightLight = new THREE.PointLight(0x88aaff, 0.8)
        rightLight.position.set(8, 2, 3)
        scene.add(rightLight)

        const leftLight = new THREE.PointLight(0x4466aa, 0.6)
        leftLight.position.set(-3, 2, 4)
        scene.add(leftLight)

        const topLight = new THREE.PointLight(0xffffff, 0.5)
        topLight.position.set(2, 6, 2)
        scene.add(topLight)

        const starsGeometry = new THREE.BufferGeometry()
        const starsCount = 2500
        const starsPositions = new Float32Array(starsCount * 3)
        const starsColors = new Float32Array(starsCount * 3)

        for (let i = 0; i < starsCount * 3; i += 3) {
          const r = 40 + Math.random() * 100
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos(Math.random() * 2 - 1)

          starsPositions[i] = Math.sin(phi) * Math.cos(theta) * r
          starsPositions[i + 1] = Math.sin(phi) * Math.sin(theta) * r
          starsPositions[i + 2] = Math.cos(phi) * r

          const colorVal = 0.7 + Math.random() * 0.3
          starsColors[i] = colorVal
          starsColors[i + 1] = colorVal
          starsColors[i + 2] = colorVal
        }

        starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3))
        starsGeometry.setAttribute("color", new THREE.BufferAttribute(starsColors, 3))

        const starsMaterial = new THREE.PointsMaterial({
          size: 0.25,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          blending: THREE.AdditiveBlending,
        })

        const stars = new THREE.Points(starsGeometry, starsMaterial)
        starsRef.current = stars
        scene.add(stars)

        const nearStarsGeometry = new THREE.BufferGeometry()
        const nearStarsCount = 800
        const nearStarsPositions = new Float32Array(nearStarsCount * 3)

        for (let i = 0; i < nearStarsCount * 3; i += 3) {
          nearStarsPositions[i] = (Math.random() - 0.5) * 150
          nearStarsPositions[i + 1] = (Math.random() - 0.5) * 150
          nearStarsPositions[i + 2] = (Math.random() - 0.5) * 150 - 30
        }

        nearStarsGeometry.setAttribute(
          "position",
          new THREE.BufferAttribute(nearStarsPositions, 3)
        )

        const nearStarsMaterial = new THREE.PointsMaterial({
          size: 0.15,
          color: 0xaaccff,
          transparent: true,
          opacity: 0.5,
          blending: THREE.AdditiveBlending,
        })

        const nearStars = new THREE.Points(nearStarsGeometry, nearStarsMaterial)
        nearStarsRef.current = nearStars
        scene.add(nearStars)

        const updateRotationFromScroll = () => {
          if (!cubeRef.current) return

          const scrollY = window.scrollY
          const maxScroll = document.documentElement.scrollHeight - window.innerHeight
          const scrollPercent = maxScroll > 0 ? scrollY / maxScroll : 0

          cubeRef.current.rotation.y = scrollPercent * Math.PI * 4
          cubeRef.current.rotation.x = 0.2 + Math.sin(scrollPercent * Math.PI * 2) * 0.05
        }

        updateRotationFromScroll()

        const handleScroll = () => {
          updateRotationFromScroll()
        }

        window.addEventListener("scroll", handleScroll)

        const handleResize = () => {
          if (cameraRef.current && rendererRef.current && cubeRef.current) {
            cameraRef.current.aspect = window.innerWidth / window.innerHeight
            cameraRef.current.updateProjectionMatrix()
            updateCubePosition()
            rendererRef.current.setSize(window.innerWidth, window.innerHeight)
          }
        }

        const animate = () => {
          if (starsRef.current) {
            starsRef.current.rotation.y += 0.0002
          }

          if (sceneRef.current && cameraRef.current && rendererRef.current) {
            rendererRef.current.render(sceneRef.current, cameraRef.current)
          }

          animationRef.current = requestAnimationFrame(animate)
        }

        animate()
        window.addEventListener("resize", handleResize)

        return () => {
          window.removeEventListener("resize", handleResize)
          window.removeEventListener("scroll", handleScroll)
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current)
          }
        }
      })
      .catch(err => {
        console.error("Failed to load Three.js:", err)
      })
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        display: "block",
      }}
    />
  )
}

export default WorkingCube
