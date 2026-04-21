import React, { useEffect, useRef } from 'react';
import mmrgl from 'mmr-gl';
import 'mmr-gl/dist/mmr-gl.css';
import { userLineData } from './lines/lines'
import { userPointData } from "./points/points"
import DistanceControl from "./DistanceControl"

export function SimpleMap() {
  const mapRef = useRef(null)
  const distanceControlRef = useRef(null)
  //TODO: добавить веб-воркеров
  useEffect(() => {
    if (typeof window !== "undefined") {
      mmrgl.accessToken = process.env.GATSBY_MMR_TOKEN

      const map = new mmrgl.Map({
        container: "map",
        zoom: 8,
        center: [37.6165, 55.7505],
        style: "mmr://api/styles/main_style.json",
        hash: true,
      })

      // Отображение линий
      map.on("load", function () {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: userLineData,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#AE3478",
            "line-width": 8,
          },
        })
      })

      const coordinates = [37.62, 55.74]

      var marker = new mmrgl.Marker().setLngLat(coordinates).setPopup(
        new mmrgl.Popup().setHTML(`
          <div style="text-align: center;">
            <img 
                src="https://urcomsod.ru/assets/components/phpthumbof/cache/213.a4f2d4a453b8bedd2fd093f12726df4d.png" 
                alt="Подстанция"
                style="width: 100%; max-width: 200px; border-radius: 8px;  margin: auto;"
            />
            <hr style="margin: 2px 0; border: none; border-top: 1px solid #ccc;" />
            <div style="font-size: 12px; line-height: 1.5; text-align: left;">
                <strong>Тип сооружения:</strong> Электрическая подстанция<br />
                <strong>Название:</strong> ПС "Центральная"<br />
                <strong>Напряжение:</strong> 110 кВ<br />
                <strong>Статус:</strong> Работает<br />
                <strong>Описание:</strong> Обеспечивает электроэнергией центральный район
            </div>
            <hr style="margin: 10px 0; border: none; border-top: 1px solid #ccc;" />
            <div style="font-size: 12px; color: #666;">
                📍 Координаты: ${coordinates[0]}, ${coordinates[1]}
            </div>
        </div>
        `)
      )

      // Сохраняем ссылку на map в локальную переменную
      mapRef.current = map

      // Отображение точек
      map.on("load", function () {
        marker.addTo(map)
        map.loadImage(
          "https://maps.vk.com/api/styles/pins/blue_target.png",
          function (error, image) {
            if (error) throw error
            map.addImage("custom_pin", image)
            map.addLayer({
              id: "points",
              type: "symbol",
              source: {
                type: "geojson",
                data: userPointData,
              },
              layout: {
                "icon-image": "custom_pin",
                "icon-size": 1,
              },
            })
          }
        )
      })

      // Инициализируем контрол измерения расстояния
      distanceControlRef.current = new DistanceControl(map)

      // Создаем локальную переменную для cleanup
      const currentMap = map
      const currentDistanceControl = distanceControlRef.current

      return () => {
        // Используем локальные переменные в cleanup
        if (currentDistanceControl) {
          currentDistanceControl.remove()
        }
        if (currentMap) {
          currentMap.remove()
        }
      }
    }
  }, [])

  return <div id="map" style={{ width: "100%", height: "100vh" }} />
}