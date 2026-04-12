import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Polyline } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Фикс для иконок Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
})

const SimpleMap = () => {
  const [lines, setLines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Загружаем KML файл
    fetch("/map.kml")
      .then(response => response.text())
      .then(kmlText => {
        // Парсим KML
        const parser = new DOMParser()
        const kml = parser.parseFromString(kmlText, "text/xml")

        // Ищем все линии
        const lineStrings = kml.getElementsByTagName("LineString")
        const parsedLines = []

        for (let i = 0; i < lineStrings.length; i++) {
          const coordsElem =
            lineStrings[i].getElementsByTagName("coordinates")[0]
          if (coordsElem) {
            const coordsText = coordsElem.textContent.trim()
            const points = coordsText.split(/\s+/).map(point => {
              const [lng, lat] = point.split(",")
              return [parseFloat(lat), parseFloat(lng)]
            })
            parsedLines.push(points)
          }
        }

        setLines(parsedLines)
        setLoading(false)
      })
      .catch(error => {
        console.error("Ошибка загрузки KML:", error)
        setLoading(false)
      })
  }, [])

  // Центр карты (из вашего KML)
  const center = [55.74847, 37.61469]

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Загрузка карты...
      </div>
    )
  }

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      {/* Стиль карты CartoDB Light */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {/* Рисуем линии */}
      {lines.map((line, idx) => (
        <Polyline
          key={idx}
          positions={line}
          pathOptions={{
            color: "#2dc0fb",
            weight: 4.8,
            opacity: 0.9,
          }}
        />
      ))}
    </MapContainer>
  )
}

export default SimpleMap
