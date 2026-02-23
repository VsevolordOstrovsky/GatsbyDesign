import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import CometBackground from "../components/comet-background"
import HologramGlobe from "../components/hologram-globe"
import * as styles from "./page-2.module.css"

const services = [
  {
    title: "Аренда оптических волокон",
    subtitle: "в волоконно-оптическом кабеле",
    text: "Предоставление волокон в аренду для операторов связи и крупных организаций с распределенной инфраструктурой.",
  },
  {
    title: "Продажа оптических",
    subtitle: "волокон",
    text: "Передача волокон в собственность как долгосрочное решение задач связи и масштабирования сетей.",
  },
  {
    title: "Обслуживание",
    subtitle: "волоконно-оптических линий",
    text: "Техническое обслуживание ВОЛС, контроль состояния магистралей и оперативная поддержка рабочих участков.",
  },
  {
    title: "Проектирование",
    subtitle: "линий связи",
    text: "Проектные работы с учетом маршрутов, нагрузки и требований к надежности каналов связи.",
  },
  {
    title: "Строительно-монтажные",
    subtitle: "и земляные работы",
    text: "Полный комплекс строительно-монтажных этапов при создании и расширении волоконно-оптической инфраструктуры.",
  },
  {
    title: "Долевое участие",
    subtitle: "в строительстве",
    text: "Партнерские форматы развития сетей с прозрачной моделью участия и распределения ресурсов.",
  },
]

const serviceIcons = [
  "M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5M16 19h3m-3-3h6M12 17v-7M8 15l4-4 4 4",
  "M3 3v18h18M3 12h18M3 6h18M3 9h18M3 15h18M3 18h18M16 3l-4 18M8 3l4 18",
  "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  "m16 18 2-2-2-2M8 18l-2-2 2-2M12 12v4M7 4h10M12 4v4 M8 8h8a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4Z",
  "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0 M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5",
  "M5 12h14M12 5l7 7-7 7",
]

const serviceSectionCopies = [0, 1]

const handleSectionWaveEnter = event => {
  if (event.currentTarget.dataset.waveActive === "1") {
    return
  }

  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const distances = {
    left: x,
    right: rect.width - x,
    top: y,
    bottom: rect.height - y,
  }

  let closestSide = "left"
  let minDistance = distances.left

  Object.entries(distances).forEach(([side, distance]) => {
    if (distance < minDistance) {
      minDistance = distance
      closestSide = side
    }
  })

  const direction =
    closestSide === "left"
      ? "to-right"
      : closestSide === "right"
        ? "to-left"
        : x < rect.width / 2
          ? "to-right"
          : "to-left"

  event.currentTarget.dataset.waveDirection = direction
  event.currentTarget.dataset.waveActive = "1"
}

const handleSectionWaveLeave = event => {
  event.currentTarget.dataset.waveActive = "0"
}

const handleSectionWaveAnimationEnd = event => {
  event.currentTarget.dataset.waveActive = "0"
}

const contactItems = [
  {
    type: "phone",
    label: "Телефон 1",
    value: "+7 (495) 000-00-01",
    href: "tel:+74950000001",
  },
  {
    type: "phone",
    label: "Телефон 2",
    value: "+7 (4912) 00-00-02",
    href: "tel:+74912000002",
  },
  {
    type: "mail",
    label: "Почта 1",
    value: "sales@ul-com.ru",
    href: "mailto:sales@ul-com.ru",
  },
  {
    type: "mail",
    label: "Почта 2",
    value: "support@ul-com.ru",
    href: "mailto:support@ul-com.ru",
  },
  {
    type: "address",
    label: "Адрес",
    value: "г. Москва, ул. Пример, д. 1",
    href: "https://yandex.ru/maps/?text=%D0%B3.%20%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0%2C%20%D1%83%D0%BB.%20%D0%9F%D1%80%D0%B8%D0%BC%D0%B5%D1%80%2C%20%D0%B4.%201",
  },
]

const ContactIcon = ({ type }) => {
  if (type === "phone") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .8 2.8a2 2 0 0 1-.4 2.1L8.2 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.4 1.8.7 2.8.8A2 2 0 0 1 22 16.9z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (type === "mail") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m22 7-10 7L2 7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

const SecondPage = () => (
  <Layout>
    <section className={styles.page}>
      <div className={styles.cometsLayer} aria-hidden="true">
        <CometBackground />
      </div>

      <div className={styles.layout}>
        <main className={styles.mainColumn}>
          <header className={styles.hero}>
            <p className={styles.kicker}>3D Landing</p>
            <h1 className={styles.title}>
              Минималистичный сайт
              <br />
              про пространственный веб
            </h1>
            <p className={styles.lead}>
              Длинная страница с мягкой динамикой фона, чистой типографикой и
              акцентом на смысловые блоки.
            </p>
          </header>

          {serviceSectionCopies.map(copyIndex => (
            <section
              key={`services-copy-${copyIndex}`}
              className={`${styles.section} ${copyIndex === 0 ? styles.sectionBaseCopy : ""} ${copyIndex === 1 ? styles.sectionSpecialCopy : ""}`}
            >
              {copyIndex === 1 && (
                <div className={styles.bluePatternBg} aria-hidden="true">
                  <div className={styles.bluePatternShine} />
                  <div className={styles.bluePatternTiles}>
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile1}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile2}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile3}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile4}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile5}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile6}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile7}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile8}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile9}`} />
                    <div className={`${styles.bluePatternTile} ${styles.bluePatternTile10}`} />
                  </div>
                  <div className={`${styles.bluePatternLine} ${styles.bluePatternLine1}`} />
                  <div className={`${styles.bluePatternLine} ${styles.bluePatternLine2}`} />
                  <div className={`${styles.bluePatternLine} ${styles.bluePatternLine3}`} />
                </div>
              )}

              <h2 className={styles.sectionTitle}>Волоконно-оптические линии связи (ВОЛС)</h2>
              <p className={styles.paragraph}>
                Предоставление в аренду, продажа и обслуживание, строительство,
                проектирование и монтаж линий связи.
              </p>
              <p className={styles.paragraph}>
                АО "ЮЛ-ком" создано в 2002 году для осуществления деятельности по
                строительству и предоставлению в аренду оптических волокон ВОЛС.
              </p>
              <p className={styles.paragraph}>
                Сегодня компания обладает собственной магистральной
                волоконно-оптической сетью в Москве и Московской области, а также
                в Рязани и Рязанской области.
              </p>

              <h3 className={styles.servicesTitle}>Наши услуги</h3>
              <div className={styles.servicesGrid}>
                {services.map((service, index) => (
                  <article key={`${copyIndex}-${service.title}`} className={styles.serviceCard}>
                    <div className={styles.serviceCardContent}>
                      <svg className={styles.serviceIcon} viewBox="0 0 24 24" fill="none">
                        <path d={serviceIcons[index % serviceIcons.length]} />
                      </svg>
                      <h4 className={styles.serviceTitle}>
                        {service.title}
                        <br />
                        {service.subtitle}
                      </h4>
                      <p className={styles.serviceText}>{service.text}</p>
                      <button type="button" className={styles.serviceButton}>
                        Подробнее
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Процесс</h2>
            <p className={styles.paragraph}>
              Сначала определяется ритм интерфейса: контраст, интервалы,
              иерархия. Затем добавляется только необходимая графика и
              анимация, чтобы не перегружать восприятие.
            </p>
            <p className={styles.paragraph}>
              Визуальный язык ограничен тремя цветами: белый фон, синий свет,
              красные маркеры. Такой набор удерживает фокус и поддерживает
              минимализм.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Результат</h2>
            <p className={styles.paragraph}>
              Лендинг масштабируется по высоте, а кометы остаются фоновым
              динамическим слоем на всем пути скролла.
            </p>
            <div className={styles.actions}>
              <a
                href="https://threejs.org"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.primaryButton}
              >
                Документация Three.js
              </a>
              <Link to="/" className={styles.secondaryLink}>
                На главную
              </Link>
            </div>
          </section>

        </main>

        <aside className={styles.sideColumn}>
          <Link
            to="/map"
            className={styles.globeWrap}
            aria-label="Открыть страницу карты"
            onMouseMove={event => {
              const rect = event.currentTarget.getBoundingClientRect()
              const x = ((event.clientX - rect.left) / rect.width) * 100
              const y = ((event.clientY - rect.top) / rect.height) * 100
              event.currentTarget.style.setProperty("--mx", `${x}%`)
              event.currentTarget.style.setProperty("--my", `${y}%`)
            }}
            onMouseLeave={event => {
              event.currentTarget.style.setProperty("--mx", "50%")
              event.currentTarget.style.setProperty("--my", "50%")
            }}
          >
            <div className={styles.globeScene}>
              <HologramGlobe />
            </div>
            <span className={styles.globeHint}>Открыть карту</span>
            <span className={styles.magnifier} aria-hidden="true">
              <span className={styles.magnifierGlass} />
            </span>
          </Link>
        </aside>
      </div>

      <section className={styles.contactsBand}>
        <div className={styles.contactsSection}>
          <h2 className={styles.sectionTitle}>Контакты</h2>
          <ul className={styles.contactSkewList}>
            {contactItems.map(item => (
              <li key={`${item.type}-${item.value}`} className={styles.contactSkewItem}>
                <a
                  href={item.href}
                  className={styles.contactSkewLink}
                  target={item.type === "address" ? "_blank" : undefined}
                  rel={item.type === "address" ? "noopener noreferrer" : undefined}
                >
                  <span className={styles.contactSkewIcon}>
                    <ContactIcon type={item.type} />
                  </span>
                  <span className={styles.contactSkewText}>
                    {item.label}: {item.value}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  </Layout>
)

export const Head = () => <Seo title="3D Gatsby сайт" />

export default SecondPage
