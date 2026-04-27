import React from "react"
import loadable from "@loadable/component"

const SimpleMap = loadable(() => import("../components/SimpleMap"), {
  ssr: false,
  fallback: <div style={{ padding: "2rem" }}>Загрузка карты...</div>,
})

const MapPage = () => {
  return (
    <div style={{ margin: 0, padding: 0 }}>
      <SimpleMap />
    </div>
  )
}

export default MapPage
