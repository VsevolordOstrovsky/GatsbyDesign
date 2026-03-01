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
import WorldMapTexture from "../images/vecteezy_world-map-background-grey-color-with-national-borders_10158602.jpg"

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
    const hologramMaterial = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: earthTexture },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec2 vUv;
        uniform sampler2D map;
        void main() {
          float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          float bands = sin((vWorldPosition.y + 1.0) * 40.0) * 0.04;
          float glow = clamp(fresnel + bands, 0.0, 1.0);
          vec3 mapColor = texture2D(map, vUv).rgb;
          float mapValue = dot(mapColor, vec3(0.299, 0.587, 0.114));
          float landMask = smoothstep(0.3, 0.55, 1.0 - mapValue);
          float edge = smoothstep(0.45, 0.6, 1.0 - mapValue) - smoothstep(0.6, 0.72, 1.0 - mapValue);
          vec3 baseColor = mix(vec3(0.02, 0.08, 0.22), vec3(0.12, 0.38, 0.62), glow * 0.6);
          vec3 landColor = mix(baseColor, vec3(0.4, 0.8, 1.0), landMask);
          landColor += edge * vec3(0.2, 0.45, 0.8);
          float alpha = 0.22 + glow * 0.25 + landMask * 0.4;
          gl_FragColor = vec4(landColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })

    const globe = new THREE.Mesh(globeGeometry, hologramMaterial)


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
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
          gl_FragColor = vec4(0.35, 0.7, 1.0, 1.0) * intensity;
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
    globeGroup.add(globe, atmosphere)
    scene.add(globeGroup)

    const resize = () => {
      const { width, height } = container.getBoundingClientRect()
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener("resize", resize)

    let targetRotationX = 0
    let targetRotationY = 0

    const handleMove = event => {
      const rect = container.getBoundingClientRect()
      const x = (event.clientX - rect.left) / rect.width - 0.5
      const y = (event.clientY - rect.top) / rect.height - 0.5
      targetRotationY = x * 0.35
      targetRotationX = y * 0.2
    }

    const resetTilt = () => {
      targetRotationX = 0
      targetRotationY = 0
    }

    container.addEventListener("mousemove", handleMove)
    container.addEventListener("mouseleave", resetTilt)

    let frameId = 0
    const animate = () => {
      globe.rotation.y += 0.0025
      globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.06
      globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.06
      renderer.render(scene, camera)
      frameId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(frameId)
      window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", handleMove)
      container.removeEventListener("mouseleave", resetTilt)
      globeGeometry.dispose()
      hologramMaterial.dispose()
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

      <section className={styles.globeSection} id="coverage">
        <div className={styles.globeInner}>
          <h2 className={styles.globeTitle}>Глобус сети</h2>
          <p className={styles.globeSubtitle}>
            Визуализация волоконно-оптической инфраструктуры в 3D.
          </p>
          <div className={styles.globeCanvas} ref={globeRef} />
        </div>
      </section>
    </div>
  )
}

export const Head = () => <Seo title="ЮЛ-ком | ВОЛС" />

export default UsingTypescriptPage



