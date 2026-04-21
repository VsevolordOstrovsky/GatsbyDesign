import mmrgl from "mmr-gl"

class DistanceControl {
  constructor(map) {
    this.map = map
    this.isMeasuring = false
    this.points = []
    this.tempMarker = null
    this.lineLayer = null
    this.markers = []
    this.distanceDisplay = null

    this.init()
  }

  // Формула гаверсинуса для расчета расстояния
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371 // Радиус Земли в км
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance
  }

  // Создание кнопки управления
  createControlButton() {
    const button = document.createElement("div")
    button.className = "distance-control"
    button.innerHTML = "📏 Измерить расстояние"
    button.style.cssText = `
      position: absolute;
      top: 10px;
      right: 10px;
      background: white;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      z-index: 1000;
      transition: all 0.3s ease;
    `

    button.onmouseenter = () => {
      button.style.background = "#f0f0f0"
    }
    button.onmouseleave = () => {
      if (!this.isMeasuring) {
        button.style.background = "white"
      }
    }
    button.onclick = () => this.toggleMeasurement()

    return button
  }

  // Создание дисплея для отображения расстояния
  createDistanceDisplay() {
    const display = document.createElement("div")
    display.id = "distance-display"
    display.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(0,0,0,0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      pointer-events: none;
      backdrop-filter: blur(5px);
      display: none;
    `
    return display
  }

  // Обновление отображения расстояния
  updateDistanceDisplay() {
    if (this.points.length < 2) {
      if (this.distanceDisplay) {
        this.distanceDisplay.style.display = "none"
      }
      return
    }

    let totalDistance = 0
    for (let i = 1; i < this.points.length; i++) {
      totalDistance += this.calculateDistance(
        this.points[i - 1].lat,
        this.points[i - 1].lng,
        this.points[i].lat,
        this.points[i].lng
      )
    }

    const km = totalDistance.toFixed(2)
    const meters = (totalDistance * 1000).toFixed(0)

    this.distanceDisplay.innerHTML = `📏 Расстояние: ${km} км (${meters} м)`
    this.distanceDisplay.style.display = "block"
  }

  // Обновление линии на карте
  updateLine() {
    // Удаляем старую линию
    if (this.lineLayer) {
      this.map.removeLayer(this.lineLayer)
      this.lineLayer = null
    }
    if (this.map.getSource("measure-line")) {
      this.map.removeSource("measure-line")
    }

    if (this.points.length < 2) return

    // Создаем GeoJSON для линии
    const coordinates = this.points.map(p => [p.lng, p.lat])

    this.map.addSource("measure-line", {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: coordinates,
        },
      },
    })

    this.map.addLayer({
      id: "measure-line",
      type: "line",
      source: "measure-line",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#FF4444",
        "line-width": 3,
        "line-dasharray": [5, 5],
      },
    })
    this.lineLayer = "measure-line"
  }

  // Добавление точки на карту
  addPoint(lng, lat) {
    // Создаем маркер
    const marker = new mmrgl.Marker({
      color: "#FF4444",
      draggable: false,
    })
      .setLngLat([lng, lat])
      .addTo(this.map)

    // Добавляем всплывающую подсказку с номером точки
    const pointNumber = this.points.length + 1
    const popup = new mmrgl.Popup({ offset: 25 }).setHTML(
      `<strong>Точка ${pointNumber}</strong><br/>${lng.toFixed(
        4
      )}, ${lat.toFixed(4)}`
    )

    marker.setPopup(popup)

    this.points.push({ lng, lat, marker })
    this.markers.push(marker)

    // Обновляем линию и расстояние
    this.updateLine()
    this.updateDistanceDisplay()
  }

  // Очистка всех измерений
  clearMeasurement() {
    // Удаляем все маркеры
    this.markers.forEach(marker => marker.remove())
    this.markers = []
    this.points = []

    // Удаляем линию
    if (this.lineLayer) {
      this.map.removeLayer(this.lineLayer)
      this.lineLayer = null
    }
    if (this.map.getSource("measure-line")) {
      this.map.removeSource("measure-line")
    }

    // Скрываем дисплей
    if (this.distanceDisplay) {
      this.distanceDisplay.style.display = "none"
    }
  }

  // Включение/выключение режима измерения
  toggleMeasurement() {
    this.isMeasuring = !this.isMeasuring

    const controlBtn = document.querySelector(".distance-control")
    if (controlBtn) {
      if (this.isMeasuring) {
        controlBtn.style.background = "#4CAF50"
        controlBtn.style.color = "white"
        controlBtn.innerHTML = "📏 Измерение активно... (кликните на карту)"
      } else {
        controlBtn.style.background = "white"
        controlBtn.style.color = "black"
        controlBtn.innerHTML = "📏 Измерить расстояние"
        this.clearMeasurement()
      }
    }
  }

  // Обработчик клика по карте
  onMapClick(e) {
    if (!this.isMeasuring) return
    this.addPoint(e.lngLat.lng, e.lngLat.lat)
  }

  // Обработчик движения мыши
  onMouseMove(e) {
    if (this.isMeasuring) {
      this.map.getCanvas().style.cursor = "crosshair"
    } else {
      this.map.getCanvas().style.cursor = ""
    }
  }

  // Инициализация контрола
  init() {
    const controlBtn = this.createControlButton()
    const distanceDisplay = this.createDistanceDisplay()

    this.map.getContainer().appendChild(controlBtn)
    this.map.getContainer().appendChild(distanceDisplay)

    this.distanceDisplay = distanceDisplay

    // Привязываем обработчики событий
    this.boundOnMapClick = this.onMapClick.bind(this)
    this.boundOnMouseMove = this.onMouseMove.bind(this)

    this.map.on("click", this.boundOnMapClick)
    this.map.on("mousemove", this.boundOnMouseMove)
  }

  // Удаление контрола (для очистки)
  remove() {
    this.map.off("click", this.boundOnMapClick)
    this.map.off("mousemove", this.boundOnMouseMove)
    this.clearMeasurement()

    const controlBtn = document.querySelector(".distance-control")
    const distanceDisplay = document.getElementById("distance-display")

    if (controlBtn) controlBtn.remove()
    if (distanceDisplay) distanceDisplay.remove()
  }
}

export default DistanceControl
