import * as React from "react"

import Layout from "../components/layout"
import Seo from "../components/seo"

const MapPage = () => (
  <Layout>
    <section
      style={{
        minHeight: "70vh",
        display: "grid",
        placeItems: "center",
      }}
    >
      <h1
        style={{
          margin: 0,
          fontSize: "clamp(2.2rem, 8vw, 6rem)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "#103f9c",
          textAlign: "center",
        }}
      >
        Здесь будет карта
      </h1>
    </section>
  </Layout>
)

export const Head = () => <Seo title="Карта" />

export default MapPage
