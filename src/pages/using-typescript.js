import * as React from "react"
import { Link } from "gatsby"
import * as THREE from "three"

import Seo from "../components/seo"
import * as styles from "./using-typescript.module.css"
import OptovoloknoMain from "../images/optovolokno_main.jpg"
import ArendaImage from "../images/arenda_optovolokna.jpg"
import ProdazhaImage from "../images/prodazha.jpg"
import ObsluzhivanieImage from "../images/obsluzhivanie.jpg"
import MontazhImage from "../images/montazh.jpg"
import DelovoeUchastieImage from "../images/delovoeuchastie.jpg"
import FiberSchemeImage from "../images/fiber-scheme.svg"
import RouteBuildImage from "../images/route-build.svg"
import UlComLogo from "../images/ul-com-logo.jpg"
import WorldMapTexture from "../images/vecteezy_world-map-background-grey-color-with-national-borders_10158602.png"

const serviceCards = [
  {
    title: "Аренда оптических волокон (ВОЛС)",
    image: ArendaImage,
    alt: "Аренда оптических волокон",
  },
  {
    title: "Продажа оптических волокон (ВОЛС)",
    image: ProdazhaImage,
    alt: "Продажа оптических волокон",
  },
  {
    title: "Обслуживание оптических волокон (ВОЛС)",
    image: ObsluzhivanieImage,
    alt: "Обслуживание оптических волокон",
  },
  {
    title: "Проектные, строительно-монтажные и земляные работы",
    image: MontazhImage,
    alt: "Проектные и строительно-монтажные работы",
  },
  {
    title: "Долевое участие в строительстве",
    image: DelovoeUchastieImage,
    alt: "Долевое участие в строительстве ВОЛС",
  },
]

const networkDirections = [
  "по Рязанскому шоссе - г. Рязань",
  "по Носовихинскому шоссе - г. Железнодорожный",
  "по Горьковскому шоссе - г. Балашиха",
  "по Щелковскому шоссе до г. Ивантеевка",
  "по Ярославскому шоссе - г. Мытищи",
  "по Калужскому шоссе до г. Подольск",
]

const UsingTypescriptPage = () => {
  const servicesRef = React.useRef(null)
  const globeRef = React.useRef(null)
  const globeSectionRef = React.useRef(null)
  const globeCanvasRef = React.useRef(null)

  const scrollServices = direction => {
    if (!servicesRef.current) return
    const viewport = servicesRef.current
    const step = viewport.clientWidth * 0.92
    viewport.scrollBy({
      left: direction === "next" ? step : -step,
      behavior: "smooth",
    })
  }

  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (!globeRef.current) return

    const container = globeRef.current
    const scene = new THREE.Scene()
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0, 3.4)

    const ambientLight = new THREE.AmbientLight(0x8bc9ff, 0.3)
    const mainLight = new THREE.PointLight(0xffffff, 1.2, 10)
    mainLight.position.set(2, 0.5, 2.4)
    const rimLight = new THREE.DirectionalLight(0x2aa7ff, 0.85)
    rimLight.position.set(-2, 1.8, -1.2)
    scene.add(ambientLight, mainLight, rimLight)

    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load(WorldMapTexture, () => {
      renderer.render(scene, camera)
    })
    earthTexture.colorSpace = THREE.SRGBColorSpace
    earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy()
    earthTexture.wrapS = THREE.RepeatWrapping
    earthTexture.wrapT = THREE.ClampToEdgeWrapping

    const globeGeometry = new THREE.SphereGeometry(1, 96, 96)
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          vec3 glowColor = vec3(0.1, 0.75, 1.0);
          gl_FragColor = vec4(glowColor, fresnel * 0.85);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const glowSphere = new THREE.Mesh(globeGeometry, glowMaterial)

    const landMaterial = new THREE.MeshBasicMaterial({
      map: earthTexture,
      color: new THREE.Color(0x0b1d4a),
      transparent: true,
      opacity: 0.9,
      alphaTest: 0.04,
    })
    const landSphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.002, 96, 96),
      landMaterial
    )


    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.35);
          gl_FragColor = vec4(0.4, 0.85, 1.0, 1.0) * intensity * 1.25;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    })
    const atmosphere = new THREE.Mesh(
      new THREE.SphereGeometry(1.06, 96, 96),
      atmosphereMaterial
    )

    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 1200
    const starPositions = new Float32Array(starCount * 3)
    for (let i = 0; i < starCount; i += 1) {
      const radius = 10 + Math.random() * 10
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[i * 3 + 2] = radius * Math.cos(phi)
    }
    starsGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3))
    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.025,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    })
    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    const globeGroup = new THREE.Group()
    globeGroup.add(glowSphere, landSphere, atmosphere)
    globeGroup.rotation.y = -2.0
    globeGroup.rotation.x = 0.08
    globeGroup.rotation.z = 0.1
    scene.add(globeGroup)

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener("resize", resize)

    const section = globeSectionRef.current
    const canvasWrap = globeCanvasRef.current
    let scrollProgress = 0
    let manualProgress = 0
    let scrollLocked = false
    let lockedScrollY = 0
    const startCamera = new THREE.Vector3(0, 0, 4.0)
    const endCamera = new THREE.Vector3(0.22, 0.16, 2.4)
    const targetCamera = new THREE.Vector3()

    const updateScroll = () => {
      if (!section) return
      const rect = section.getBoundingClientRect()
      const viewport = window.innerHeight || 1
      const total = rect.height + viewport
      const progress = (viewport - rect.top) / total
      if (!scrollLocked) {
        scrollProgress = THREE.MathUtils.clamp(progress, 0, 1)
      }
      const canvasRect = canvasWrap ? canvasWrap.getBoundingClientRect() : rect
      const centerDelta =
        Math.abs(canvasRect.top + canvasRect.height / 2 - viewport / 2)
      const centerAligned = centerDelta <= 2
      if (centerAligned && !scrollLocked) {
        scrollLocked = true
        lockedScrollY = window.scrollY
        manualProgress = scrollProgress
        section.classList.add(styles.globeSectionLocked)
        document.body.style.position = "fixed"
        document.body.style.top = `-${lockedScrollY}px`
        document.body.style.left = "0"
        document.body.style.right = "0"
        document.body.style.width = "100%"
        document.body.style.overflow = "hidden"
      }
    }

    updateScroll()
    window.addEventListener("scroll", updateScroll, { passive: true })

    const unlockScroll = deltaY => {
      if (!scrollLocked) return
      scrollLocked = false
      section.classList.remove(styles.globeSectionLocked)
      document.body.style.position = ""
      document.body.style.top = ""
      document.body.style.left = ""
      document.body.style.right = ""
      document.body.style.width = ""
      document.body.style.overflow = ""
      window.scrollTo(0, lockedScrollY)
      if (deltaY) {
        window.scrollBy(0, deltaY)
      }
    }

    const handleWheel = event => {
      if (!scrollLocked) return
      event.preventDefault()
      const delta = event.deltaY / 1700
      manualProgress = THREE.MathUtils.clamp(manualProgress + delta, 0, 1)
      scrollProgress = manualProgress
      if (manualProgress <= 0 && event.deltaY < 0) {
        unlockScroll(event.deltaY)
      }
      if (manualProgress >= 1 && event.deltaY > 0) {
        unlockScroll(event.deltaY)
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false })

    let frameId = 0
    const animate = () => {
      targetCamera.lerpVectors(startCamera, endCamera, scrollProgress)
      camera.position.lerp(targetCamera, 0.08)
      camera.lookAt(0, 0, 0)
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", updateScroll)
      window.removeEventListener("wheel", handleWheel)
      if (scrollLocked) {
        unlockScroll(0)
      }
      globeGeometry.dispose()
      glowMaterial.dispose()
      landSphere.geometry.dispose()
      landMaterial.dispose()
      atmosphere.geometry.dispose()
      atmosphereMaterial.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
      earthTexture.dispose()
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className={styles.page}>
      <header className={styles.topBar}>
        <div className={styles.topBarInner}>
          <p className={styles.productName}>ЗАО "ЮЛ-ком"</p>
          <div className={styles.actions}>
            <a className={styles.navLink} href="#services">
              Услуги
            </a>
            <a className={styles.navLink} href="#coverage">
              Схема сети
            </a>
            <a className={styles.buyButton} href="#contacts">
              Контакты
            </a>
          </div>
        </div>
      </header>

      <section className={styles.hero} id="overview">
        <img
          className={styles.heroImage}
          src={OptovoloknoMain}
          alt="Оптоволоконная магистраль"
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.heroBrand}>UL-COM</h1>
          <p className={styles.heroTagline}>Волоконно-оптические линии связи</p>
        </div>
      </section>

      <section className={styles.section} id="services">
        <div className={styles.sectionInner}>
          <h2 className={styles.sectionTitle}>Услуги компании</h2>
          <p className={styles.sectionLead}>
            Предоставление высокоскоростных каналов передачи данных и доступа в
            Интернет.
          </p>

          <div className={styles.servicesControls}>
            <button
              type="button"
              className={styles.servicesControl}
              onClick={() => scrollServices("prev")}
              aria-label="Прокрутить услуги влево"
            >
              &larr;
            </button>
            <button
              type="button"
              className={styles.servicesControl}
              onClick={() => scrollServices("next")}
              aria-label="Прокрутить услуги вправо"
            >
              &rarr;
            </button>
          </div>

          <div className={styles.servicesCarousel} ref={servicesRef}>
            {serviceCards.map((card, index) => (
              <article key={card.title} className={styles.serviceSlide}>
                <img
                  className={styles.serviceSlideImage}
                  src={card.image}
                  alt={card.alt}
                />
                <div className={styles.serviceSlideOverlay} />
                <p className={styles.serviceSlideNumber}>
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className={styles.serviceSlideTitle}>{card.title}</h3>
              </article>
            ))}
          </div>

          <div className={styles.performance}>
            <article className={styles.performanceCard}>
              <h3>Преимущества аренды волокон</h3>
              <p>
                Аренда оптических волокон в волоконно-оптическом кабеле позволяет
                избежать значительных разовых затрат на прокладку кабеля и
                значительно сокращает время получения сервиса.
              </p>
              <p>
                При переезде офиса клиент отказывается от арендованного сервиса и
                не несет затрат на демонтаж ранее проложенного кабеля.
              </p>
            </article>

            <article className={styles.performanceChart}>
              <h3>География сети</h3>
              <p>
                ЗАО "ЮЛ-ком" собственной волоконно-оптической сетью охватывает
                следующие направления:
              </p>
              <ul className={styles.routeList}>
                {networkDirections.map(item => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>

        </div>
      </section>

      <section className={styles.globeSection} id="coverage" ref={globeSectionRef}>
        <div className={styles.globeInner}>
          <h2 className={styles.globeTitle} data-globe-text>
            Глобус сети
          </h2>
          <p className={styles.globeSubtitle} data-globe-text>
            Визуализация волоконно-оптической инфраструктуры в 3D.
          </p>
          <div className={styles.globeCanvas} ref={globeCanvasRef}>
            <div className={styles.globeStage} ref={globeRef} />
          </div>
        </div>
      </section>

      <section className={styles.ctaSection} id="contacts">
        <h2>Контакты</h2>
        <p>
          Контактный телефон: +7 (495) 748-13-49; 8 (800) 222-35-49
          (многоканальный). E-mail: info@ul-com.ru
        </p>
        <p>Адрес: Москва, 2-ой Кабельный проезд, д. 1, офис 210.3.</p>
        <div className={styles.bottomCtas}>
          <a className={styles.buyLarge} href="mailto:info@ul-com.ru">
            Написать
          </a>
          <Link className={styles.learnLarge} to="/">
            На главную
          </Link>
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="ЮЛ-ком | ВОЛС" />

export default UsingTypescriptPage
