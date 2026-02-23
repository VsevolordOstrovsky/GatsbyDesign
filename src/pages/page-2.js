import * as React from "react"
import { Link } from "gatsby"

import Seo from "../components/seo"
import CometBackground from "../components/comet-background"
import HologramGlobe from "../components/hologram-globe"
import * as styles from "./page-2.module.css"

const focusAreas = [
  {
    id: "arenda",
    title: "АРЕНДА ВОЛС",
    subtitle: "Аренда оптических волокон",
    text: "Аренда ВОЛС подразумевает предоставление одного или нескольких волокон в кабеле АО «ЮЛ-ком». Компания также выполняет строительство трасс до объектов клиента.",
  },
  {
    id: "prodazha",
    title: "ПРОДАЖА",
    subtitle: "Продажа оптических волокон",
    text: "При продаже волокон предоставляются необходимые документы и техническая документация. Для эксплуатации приобретаемых волокон заключается договор обслуживания.",
  },
  {
    id: "obsluzhivanie",
    title: "ОБСЛУЖИВАНИЕ",
    subtitle: "Техническое сопровождение ВОЛС",
    text: "В перечень работ входит круглосуточное дежурство аварийной службы и поддержание технической базы для аварийно-восстановительных работ.",
  },
]

const expertise = [
  "Проектирование линий связи",
  "Строительно-монтажные работы",
  "Земляные работы",
  "Долевое участие в строительстве",
  "Работа с операторами связи и крупными организациями",
]

const SecondPage = () => {
  const globeZoneRef = React.useRef(null)
  const focusRefs = React.useRef({})
  const [isGlobeZoneActive, setIsGlobeZoneActive] = React.useState(false)
  const [isLensVisible, setIsLensVisible] = React.useState(false)
  const [lensPos, setLensPos] = React.useState({ x: 50, y: 50 })
  const [globeTilt, setGlobeTilt] = React.useState({ x: 0, y: 0 })
  const [activeFocusId, setActiveFocusId] = React.useState("")

  React.useEffect(() => {
    const zone = globeZoneRef.current
    if (!zone) return undefined

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const active = entry.isIntersecting
          setIsGlobeZoneActive(active)
          if (!active) setIsLensVisible(false)
        })
      },
      { threshold: 0.45 }
    )

    observer.observe(zone)
    return () => observer.disconnect()
  }, [])

  React.useEffect(() => {
    const sections = focusAreas
      .map(area => focusRefs.current[area.id])
      .filter(Boolean)
    if (!sections.length) return undefined

    const ratios = new Map()

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          ratios.set(entry.target.id, entry.intersectionRatio)
        })

        let bestId = ""
        let bestRatio = 0

        ratios.forEach((ratio, id) => {
          if (ratio >= 0.5 && ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        })

        if (bestId) {
          setActiveFocusId(bestId)
        } else {
          setActiveFocusId("")
        }
      },
      {
        threshold: [0, 0.5, 1],
        rootMargin: "25% 0px 25% 0px",
      }
    )

    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`${styles.page} ${isGlobeZoneActive ? styles.pageDarkMode : ""}`}>
      <div className={styles.cometsLayer} aria-hidden="true">
        <CometBackground />
      </div>
      <div className={styles.globeLayer}>
        <Link
          to="/map"
          className={styles.globeLayerLink}
          aria-label="Открыть страницу карты"
          onMouseMove={event => {
            if (!isGlobeZoneActive) return
            const rect = event.currentTarget.getBoundingClientRect()
            const x = ((event.clientX - rect.left) / rect.width) * 100
            const y = ((event.clientY - rect.top) / rect.height) * 100
            setLensPos({ x, y })
            setGlobeTilt({
              x: (50 - y) * 0.08,
              y: (x - 50) * 0.08,
            })
            setIsLensVisible(true)
          }}
          onMouseLeave={() => {
            setIsLensVisible(false)
            setGlobeTilt({ x: 0, y: 0 })
          }}
        >
          <div
            className={styles.globeFrame}
            style={{ "--tilt-x": `${globeTilt.x}deg`, "--tilt-y": `${globeTilt.y}deg` }}
          >
            <HologramGlobe />
          </div>
          {isGlobeZoneActive && (
            <div
              className={`${styles.globeLens} ${isLensVisible ? styles.globeLensVisible : ""}`}
              style={{ "--mx": `${lensPos.x}%`, "--my": `${lensPos.y}%` }}
              aria-hidden="true"
            />
          )}
        </Link>
      </div>
      <div className={styles.backdrop} aria-hidden="true" />
      <div className={styles.gridOverlay} aria-hidden="true" />

      <aside className={styles.dock}>
        <p className={styles.dockLabel}>Меню</p>
        <nav className={styles.dockNav} aria-label="Section navigation">
          <a href="#arenda">Аренда</a>
          <a href="#prodazha">Продажа</a>
          <a href="#obsluzhivanie">Сервис</a>
          <a href="#hello">Контакты</a>
        </nav>
      </aside>

      <main className={styles.content}>
        <header className={styles.hero}>
          <p className={styles.heroMeta}>Волоконно-оптические линии связи (ВОЛС)</p>
          <h1 className={styles.heroTitle}>
            ЮЛ-КОМ
            <span>Линии связи</span>
          </h1>
          <p className={styles.heroText}>
            Предоставление в аренду, продажа и обслуживание, строительство, проектирование и монтаж линий связи.
          </p>
        </header>

        {focusAreas.map(area => (
          <section
            key={area.id}
            id={area.id}
            ref={node => {
              focusRefs.current[area.id] = node
            }}
            className={`${styles.focusSection} ${activeFocusId === area.id ? styles.focusSectionActive : ""}`}
          >
            <p className={styles.focusWord}>{area.title}</p>
            <div className={styles.focusCopy}>
              <h2>{area.subtitle}</h2>
              <p>{area.text}</p>
            </div>
          </section>
        ))}

        <section className={styles.expertiseSection}>
          <p className={styles.blockLabel}>НАШИ УСЛУГИ</p>
          <ul>
            {expertise.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ul>
        </section>

        <section
          ref={globeZoneRef}
          className={styles.globeAccessSection}
          aria-label="Зона перехода к карте"
        >
          <div aria-hidden="true" />
        </section>

        <section id="hello" className={styles.helloSection}>
          <p className={styles.blockLabel}>КОНТАКТЫ</p>
          <h2>Связаться с нами</h2>
          <a href="mailto:info@ul-com.ru" className={styles.helloLink}>
            info@ul-com.ru
          </a>
          <p className={styles.contactText}>+7 (495) 748-13-49 • 8 (800) 222-35-49</p>
          <p className={styles.contactText}>Москва, 2-ой Кабельный проезд, д. 1</p>
          <div className={styles.actions}>
            <Link to="/" className={styles.actionGhost}>
              Главная
            </Link>
            <Link to="/map" className={styles.actionSolid}>
              Карта
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}

export const Head = () => <Seo title="ЮЛ-ком | ВОЛС" />

export default SecondPage
