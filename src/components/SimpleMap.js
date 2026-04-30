import React, { useEffect, useRef } from 'react';
import mmrgl from 'mmr-gl';
import 'mmr-gl/dist/mmr-gl.css';
import { userLineData } from './lines/lines'
import { userPointData } from "./points/points"
import DistanceControl from "./DistanceControl"
import map_style from "../styles/map_style.json"

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
        style: map_style,
        hash: true,
      })

      // Сохраняем ссылку на map в локальную переменную
      mapRef.current = map

      // Отображение линий
      map.on("load", function () {
        map.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: "/map.geojson",
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#dc2d9c",
            "line-width": 2,
          },
        })
      })

      // Отображаем точки на карте БЕЗ КЛАСТЕРИЗАЦИИ
      map.on("load", () =>  {
        fetch("/map.geojson")
          .then(response => response.json())
          .then(data => {
            // Просто добавляем маркеры, без кластеризации
            data.features.filter(object => object.geometry?.type === "Point").forEach(feature => {
              const [lng, lat] = feature.geometry.coordinates
              new mmrgl.Marker({scale: 0.75})
                .setLngLat([lng, lat])
                .setPopup(
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
                          <strong>Название:</strong> ${feature.properties.name} <br />
                          <strong>Статус:</strong> Работает<br />
                          <strong>Описание:</strong> Обеспечивает электроэнергией центральный район
                      </div>
                      <hr style="margin: 10px 0; border: none; border-top: 1px solid #ccc;" />
                      <div style="font-size: 12px; color: #666;">
                          📍 Координаты: ${feature.geometry.coordinates[0]}, ${feature.geometry.coordinates[0]}
                      </div>
                    </div>
                  `)
                )
                .addTo(map)
            })

            console.log(`Добавлено ${data.features.length} маркеров`)
          })
      })

      map.addControl(new mmrgl.NavigationControl(), "top-left");

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
      };
    }
  }, [])

  return <div id="map" style={{ width: "100%", height: "100vh" }} />
}