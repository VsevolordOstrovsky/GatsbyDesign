import mmrgl from "mmr-gl"

class DistanceControl {
  constructor(map) {
    this.map = map
    this.isMeasuring = false
    this.points = []
    this.tempMarker = null
    this.lineLayer = null
    this.markers = []
    this.currentLabel = null // Только одна метка для последней точки
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

  // Получение общего расстояния
  getTotalDistance() {
    if (this.points.length < 2) return 0

    let totalDistance = 0
    for (let i = 1; i < this.points.length; i++) {
      totalDistance += this.calculateDistance(
        this.points[i - 1].lat,
        this.points[i - 1].lng,
        this.points[i].lat,
        this.points[i].lng
      )
    }
    return totalDistance
  }

  // Создание обычного маркера (красная точка)
  createMarker(lng, lat) {
    const el = document.createElement("div")
    el.style.cssText = `
      width: 12px;
      height: 12px;
      background-color: #FF4444;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    `

    const marker = new mmrgl.Marker({ element: el })
      .setLngLat([lng, lat])
      .addTo(this.map)

    return marker
  }

  // Создание метки с общим расстоянием (рядом с последней точкой)
  createDistanceLabel(lng, lat, totalDistance) {
    // Удаляем старую метку, если есть
    if (this.currentLabel) {
      this.currentLabel.remove()
    }

    // Форматируем расстояние
    let formattedDistance
    if (totalDistance < 1) {
      // Меньше 1 км - показываем в метрах
      const meters = Math.round(totalDistance * 1000)
      formattedDistance = `${meters} м`
    } else {
      // Больше или равно 1 км - показываем в км с 1 знаком после запятой
      formattedDistance = `${totalDistance.toFixed(1)} км`
    }

    const el = document.createElement("div")
    el.innerHTML = `
    <div style="
      background: rgba(0,0,0,0.75);
      color: white;
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 13px;
      font-weight: bold;
      font-family: Arial, sans-serif;
      white-space: nowrap;
      border: 1px solid rgba(255,255,255,0.3);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
    ">
      📏 ${formattedDistance}
    </div>
  `

    // Смещаем метку вправо от точки
    const labelMarker = new mmrgl.Marker({ element: el, offset: [15, -10] })
      .setLngLat([lng, lat])
      .addTo(this.map)

    this.currentLabel = labelMarker
    return labelMarker
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

  // Создание дисплея для отображения общего расстояния
  createDistanceDisplay() {
    const display = document.createElement("div")
    display.id = "distance-display"
    display.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 20px;
      background: rgba(0,0,0,0.7);
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

  // Обновление отображения общего расстояния внизу
  updateDistanceDisplay() {
    if (this.points.length < 2) {
      if (this.distanceDisplay) {
        this.distanceDisplay.style.display = "none"
      }
      return
    }

    const totalDistance = this.getTotalDistance()

    // Форматируем расстояние для отображения внизу
    let formattedDistance
    if (totalDistance < 1) {
      const meters = Math.round(totalDistance * 1000)
      formattedDistance = `${meters} м`
    } else {
      formattedDistance = `${totalDistance.toFixed(2)} км`
    }

    this.distanceDisplay.innerHTML = `📏 Общее расстояние: ${formattedDistance}`
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

  // Обновление метки у последней точки
  updateLastPointLabel() {
    if (this.points.length < 2) {
      // Если меньше 2 точек, удаляем метку
      if (this.currentLabel) {
        this.currentLabel.remove()
        this.currentLabel = null
      }
      return
    }

    const lastPoint = this.points[this.points.length - 1]
    const totalDistance = this.getTotalDistance()

    // Создаем или обновляем метку у последней точки
    this.createDistanceLabel(lastPoint.lng, lastPoint.lat, totalDistance)
  }

  // Добавление точки на карту
  addPoint(lng, lat) {
    const pointNumber = this.points.length + 1

    // Создаем обычную точку
    const marker = this.createMarker(lng, lat)

    // Сохраняем точку
    this.points.push({
      lng,
      lat,
      marker,
      pointNumber,
    })
    this.markers.push(marker)

    // Обновляем линию
    this.updateLine()

    // Обновляем общее расстояние внизу
    this.updateDistanceDisplay()

    // Обновляем метку у последней точки (показываем общее расстояние)
    this.updateLastPointLabel()

    console.log(
      `Точка ${pointNumber}: ${lng}, ${lat}, общее расстояние: ${this.getTotalDistance().toFixed(
        2
      )} км`
    )
  }

  // Очистка всех измерений
  clearMeasurement() {
    // Удаляем все маркеры
    this.markers.forEach(marker => marker.remove())
    this.markers = []
    this.points = []

    // Удаляем метку
    if (this.currentLabel) {
      this.currentLabel.remove()
      this.currentLabel = null
    }

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
