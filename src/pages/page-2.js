import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import CometBackground from "../components/comet-background"
import HologramGlobe from "../components/hologram-globe"
import * as styles from "./page-2.module.css"

const tiles = [
  {
    title: "Технологии",
    text: "Three.js + WebGL создают чистую и быструю 3D-сцену без плагинов.",
  },
  {
    title: "Архитектура",
    text: "Gatsby и React дают предсказуемую структуру и высокую скорость загрузки.",
  },
  {
    title: "UX",
    text: "Минималистичный интерфейс с акцентом на контент, анимацию и ритм секций.",
  },
]

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

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Ключевые блоки</h2>
            <div className={styles.tiles}>
              {tiles.map(tile => (
                <article key={tile.title} className={styles.tile}>
                  <h3 className={styles.tileTitle}>{tile.title}</h3>
                  <p className={styles.tileText}>{tile.text}</p>
                </article>
              ))}
            </div>
          </section>

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
    </section>
  </Layout>
)

export const Head = () => <Seo title="3D Gatsby сайт" />

export default SecondPage
