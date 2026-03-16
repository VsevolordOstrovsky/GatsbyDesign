import * as React from "react"
import { Link } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import * as styles from "./index.module.css"

const pages = [
  {
    text: "Концепт 1",
    url: "/page-2",
  },
  {
    text: "Концепт 2",
    url: "/using-typescript",
  },
]

const IndexPage = () => (
  <Layout>
    <div className={styles.page}>
      <aside className={styles.leftPanel}>
        <h1 className={styles.title}>SHOW DESIGN</h1>
        <p className={styles.subtitle}>Минималистичная навигация</p>
        <div className={styles.cards}>
          {pages.map(page => (
            <Link key={page.url} to={page.url} className={styles.card}>
              <span className={styles.cardText}>{page.text}</span>
            </Link>
          ))}
        </div>
      </aside>
      <section className={styles.rightPanel} />
    </div>
  </Layout>
)

/**
 * Head export to define metadata for the page
 *
 * See: https://www.gatsbyjs.com/docs/reference/built-in-components/gatsby-head/
 */
export const Head = () => <Seo title="Home" />

export default IndexPage
