import * as React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import * as styles from "./concept-2.module.css"
import OptovoloknoMainDark from "../images/optovolokno_main_dark.jpg"
import OptovoloknoMainLight from "../images/optovolokno_main_light.jpg"
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
  const globeCopyStartRef = React.useRef(null)
  const globeCopyMiddleRef = React.useRef(null)
  const globeCopyEndRef = React.useRef(null)
  const [theme, setTheme] = React.useState("dark")
  const [threeModule, setThreeModule] = React.useState(null)

  React.useEffect(() => {
    if (typeof window === "undefined") return

    const storedTheme = window.localStorage.getItem("concept-2-theme")
    if (storedTheme === "light" || storedTheme === "dark") {
      setTheme(storedTheme)
      return
    }

    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme("light")
    }
  }, [])

  React.useEffect(() => {
    if (typeof window === "undefined") return
    window.localStorage.setItem("concept-2-theme", theme)
  }, [theme])

  React.useEffect(() => {
    let isMounted = true

    import("three").then(module => {
      if (isMounted) {
        setThreeModule(module)
      }
    })

    return () => {
      isMounted = false
    }
  }, [])

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
    const THREE = threeModule
    if (!THREE) return
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
      color: new THREE.Color(0x4169e1),
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
    globeGroup.rotation.y = -1.9
    globeGroup.rotation.x = 0.42
    globeGroup.rotation.z = 0.1
    globeGroup.position.y = 0.16
    scene.add(globeGroup)

    const latLonToVector3 = (lat, lon, radius = 1.026) => {
      const phi = THREE.MathUtils.degToRad(90 - lat)
      const theta = THREE.MathUtils.degToRad(lon + 180)
      return new THREE.Vector3(
        -(radius * Math.sin(phi) * Math.cos(theta)),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
    }

    const routesGroup = new THREE.Group()
    globeGroup.add(routesGroup)

    // === ХАРДКОДНЫЕ ТОЧКИ (пиксельные координаты) ===
    const textureWidthPx = 1920
    const textureHeightPx = 1152
    const pixelToVector3 = (x, y, radius = 1.03) => {
      const lon = (x / textureWidthPx) * 360 - 180
      const lat = 90 - (y / textureHeightPx) * 180
      return latLonToVector3(lat, lon, radius)
    }
    const moscowPoint = pixelToVector3(1074, 425, 1.03)
    const routePixels = [
      { x: 1017, y: 400 },
      { x: 1054, y: 409 },
      { x: 1081, y: 395 },
      { x: 1120, y: 396 },
      { x: 1163, y: 418 },
      { x: 1124, y: 445 },
      { x: 1096, y: 476 },
    ]
    // =============================================

    const moscowMarkerGeometry = new THREE.SphereGeometry(0.012, 16, 16)
    const moscowMarkerMaterial = new THREE.MeshBasicMaterial({
      color: 0xff5866,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const moscowMarker = new THREE.Mesh(moscowMarkerGeometry, moscowMarkerMaterial)
    moscowMarker.position.copy(moscowPoint)
    routesGroup.add(moscowMarker)

    const routeEntries = routePixels.map((point, index) => {
      const endPoint = pixelToVector3(point.x, point.y, 1.03)
      const midpoint = moscowPoint
        .clone()
        .add(endPoint)
        .multiplyScalar(0.5)
        .normalize()
        .multiplyScalar(1.07 + moscowPoint.angleTo(endPoint) * 0.035)

      const curve = new THREE.CatmullRomCurve3([moscowPoint, midpoint, endPoint])
      const points = curve.getPoints(96)
      const glowGeometry = new THREE.BufferGeometry().setFromPoints(points)
      glowGeometry.setDrawRange(0, 2)
      const coreGeometry = new THREE.BufferGeometry().setFromPoints(points)
      coreGeometry.setDrawRange(0, 2)

      const glowMaterial = new THREE.LineBasicMaterial({
        color: 0xff5f6f,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const coreMaterial = new THREE.LineBasicMaterial({
        color: 0xff2032,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const glowLine = new THREE.Line(glowGeometry, glowMaterial)
      const coreLine = new THREE.Line(coreGeometry, coreMaterial)
      routesGroup.add(glowLine, coreLine)

      const cityMarkerMaterial = new THREE.MeshBasicMaterial({
        color: 0xff8b95,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const cityMarker = new THREE.Mesh(moscowMarkerGeometry, cityMarkerMaterial)
      cityMarker.position.copy(endPoint)
      routesGroup.add(cityMarker)

      return {
        index,
        pointCount: points.length,
        glowGeometry,
        coreGeometry,
        glowMaterial,
        coreMaterial,
        cityMarkerMaterial,
      }
    })

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener("resize", resize)

    const section = globeSectionRef.current
    let scrollProgress = 0
    const rotationStageLength = 0.45
    const routesStageLength = 2.55
    const maxLockedProgress = rotationStageLength + routesStageLength
    const scrollSlowdown = 0.8
    const lockedCamera = new THREE.Vector3(1.02, 0.24, 2.08)
    const lockedLookAt = new THREE.Vector3(0.34, 1.05, 0.43)
    const baseGlobeRotationX = 0.02
    const baseGlobeRotationY = -1.56
    const smoothFade = (value, inStart, inEnd, outStart, outEnd) => {
      const fadeIn = THREE.MathUtils.smoothstep(value, inStart, inEnd)
      const fadeOut = 1 - THREE.MathUtils.smoothstep(value, outStart, outEnd)
      return THREE.MathUtils.clamp(fadeIn * fadeOut, 0, 1)
    }

    if (section) {
      section.style.minHeight = `${(maxLockedProgress * scrollSlowdown + 1) * 100}vh`
    }

    const updateScroll = () => {
      if (!section) return
      const viewport = window.innerHeight || 1
      const sectionTop = section.offsetTop
      const sectionHeight = section.offsetHeight
      const scrollable = Math.max(1, sectionHeight - viewport)
      const rawProgress = (window.scrollY - sectionTop) / scrollable
      const normalized = THREE.MathUtils.clamp(rawProgress, 0, 1)

      scrollProgress = normalized * maxLockedProgress
      const buttonVisible = normalized >= 0.98
      if (section) {
        section.classList.toggle(styles.globeButtonVisible, buttonVisible)
      }
    }

    updateScroll()
    window.addEventListener("scroll", updateScroll, { passive: true })

    let frameId = 0
    const animate = () => {
      const totalRotationProgress = THREE.MathUtils.clamp(
        scrollProgress / maxLockedProgress,
        0,
        1
      )
      const rotationProgress = THREE.MathUtils.clamp(
        scrollProgress / rotationStageLength,
        0,
        1
      )
      const routesProgress = THREE.MathUtils.clamp(
        (scrollProgress - rotationStageLength) / routesStageLength,
        0,
        1
      )
      const rotationOffset = totalRotationProgress * 0.72
      camera.position.lerp(lockedCamera, 0.08)
      camera.lookAt(lockedLookAt)
      globeGroup.rotation.x = baseGlobeRotationX
      globeGroup.rotation.y = baseGlobeRotationY - rotationOffset

      moscowMarkerMaterial.opacity = routesProgress
      routeEntries.forEach(route => {
        const startAt = Math.min(route.index * 0.025, 0.85)
        const localProgress = THREE.MathUtils.clamp(
          (routesProgress - startAt) / (1 - startAt),
          0,
          1
        )
        const drawCount = Math.max(2, Math.floor(route.pointCount * localProgress))
        route.glowGeometry.setDrawRange(0, drawCount)
        route.coreGeometry.setDrawRange(0, drawCount)
        route.glowMaterial.opacity = localProgress * 0.92
        route.coreMaterial.opacity = localProgress
        route.cityMarkerMaterial.opacity = localProgress
      })

      const startCopyOpacity = smoothFade(scrollProgress, 0.03, 0.22, 0.84, 1.0)
      const middleCopyOpacity = smoothFade(scrollProgress, 1.08, 1.28, 1.82, 1.98)
      const endCopyOpacity = smoothFade(scrollProgress, 2.35, 2.5, 2.75, 2.9)
      if (globeCopyStartRef.current) {
        globeCopyStartRef.current.style.opacity = `${startCopyOpacity}`
        globeCopyStartRef.current.style.transform = `translateY(${(1 - startCopyOpacity) * 14}px)`
      }
      if (globeCopyMiddleRef.current) {
        globeCopyMiddleRef.current.style.opacity = `${middleCopyOpacity}`
        globeCopyMiddleRef.current.style.transform = `translateY(${(1 - middleCopyOpacity) * 14}px)`
      }
      if (globeCopyEndRef.current) {
        globeCopyEndRef.current.style.opacity = `${endCopyOpacity}`
        globeCopyEndRef.current.style.transform = `translateY(${(1 - endCopyOpacity) * 14}px)`
      }

      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("scroll", updateScroll)
      globeGeometry.dispose()
      glowMaterial.dispose()
      landSphere.geometry.dispose()
      landMaterial.dispose()
      atmosphere.geometry.dispose()
      atmosphereMaterial.dispose()
      starsGeometry.dispose()
      starsMaterial.dispose()
      moscowMarkerGeometry.dispose()
      moscowMarkerMaterial.dispose()
      routeEntries.forEach(route => {
        route.glowGeometry.dispose()
        route.coreGeometry.dispose()
        route.glowMaterial.dispose()
        route.coreMaterial.dispose()
        route.cityMarkerMaterial.dispose()
      })
      earthTexture.dispose()
      renderer.dispose()
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
    }
  }, [threeModule])

  return (
    <div
      className={`${styles.page} ${theme === "light" ? styles.pageLight : styles.pageDark}`}
    >
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
            <a className={styles.navLink} href="#full-map">
              Подробная карта
            </a>
            <a className={styles.buyButton} href="#contacts">
              Контакты
            </a>
            <button
              type="button"
              className={styles.themeToggle}
              onClick={() =>
                setTheme(currentTheme => (currentTheme === "dark" ? "light" : "dark"))
              }
              aria-label={
                theme === "dark"
                  ? "Переключить на светлую тему"
                  : "Переключить на темную тему"
              }
              aria-pressed={theme === "light"}
            >
              <span className={styles.themeToggleTrack}>
                <span className={styles.themeToggleOption}>Темная</span>
                <span className={styles.themeToggleOption}>Светлая</span>
                <span className={styles.themeToggleThumb} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <section className={styles.hero} id="overview">
        <img
          className={styles.heroImage}
          src={theme === "light" ? OptovoloknoMainLight : OptovoloknoMainDark}
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
        </div>
        <div className={styles.globeSticky}>
          <div className={styles.globeCanvas} ref={globeCanvasRef}>
            <div className={styles.globeCopyBlock}>
              <p className={styles.globeCopyLine} ref={globeCopyStartRef}>
                Высокое качество интернета для бизнеса и городской инфраструктуры.
              </p>
              <p className={styles.globeCopyLine} ref={globeCopyMiddleRef}>
                Масштабируем сеть, сохраняя скорость, резервирование и контроль качества.
              </p>
              <p className={styles.globeCopyLine} ref={globeCopyEndRef}>
                Расширяем покрытие, чтобы бизнес оставался устойчивым в любой точке.
              </p>
            </div>
            <div className={styles.globeStage} ref={globeRef} />
          </div>
          <a className={styles.globeMapButton} id="full-map" href="/map">
            Посмотреть подробную карту
          </a>
        </div>
      </section>

      <section className={styles.ctaSection} id="contacts">
        <div className={styles.footerCard}>
          <div className={styles.footerMetric}>
            <p className={styles.footerMetricLabel}>ГОД ОСНОВАНИЯ</p>
            <p className={styles.footerMetricValue}>2007</p>
          </div>
          <div className={styles.footerMetric}>
            <p className={styles.footerMetricLabel}>РАБОТАЕМ В РЕГИОНАХ</p>
            <p className={styles.footerMetricValue}>Москва и МО</p>
          </div>
        </div>

        <div className={styles.footerColumns}>
          <div className={styles.footerColumn}>
            <p className={styles.footerColumnTitle}>Связаться</p>
            <a href="mailto:info@ul-com.ru">info@ul-com.ru</a>
            <a href="tel:+74957481349">+7 (495) 748-13-49</a>
            <a href="tel:+78002223549">8 (800) 222-35-49</a>
          </div>

          <div className={styles.footerColumn}>
            <p className={styles.footerColumnTitle}>Навигация</p>
            <a href="#services">Услуги</a>
            <a href="#coverage">Схема сети</a>
            <a href="/map">Карта сети</a>
          </div>

          <div className={styles.footerColumn}>
            <p className={styles.footerColumnTitle}>Юридический адрес</p>
            <p>Москва, 2-ой Кабельный проезд, д. 1, офис 210.3</p>
          </div>

          <div className={styles.footerColumn}>
            <p className={styles.footerColumnTitle}>Режим работы</p>
            <p>Пн-Пт: 09:00-18:00</p>
            <p>Техподдержка: 24/7</p>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.footerMeta}>
            <p>ЗАО "ЮЛ-ком"</p>
            <p>Политика обработки данных</p>
          </div>
          <div className={styles.footerPillNav}>
            <a href="#services">Услуги</a>
            <a href="#coverage">Покрытие</a>
            <a href="#full-map">Карта</a>
            <Link to="/">Главная</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="ЮЛ-ком | ВОЛС" />

export default UsingTypescriptPage