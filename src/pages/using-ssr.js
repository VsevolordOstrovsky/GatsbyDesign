import * as React from "react"
import WorkingCube from "../components/WorkingCube"

import Seo from "../components/seo"

const UsingSSR = () => {
  return (
    <>
      <WorkingCube />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          color: "white",
          marginLeft: "50px",
          maxWidth: "600px",
          padding: "40px 20px",
        }}
      >
        <div style={{ marginBottom: "60px" }}>
          <h1
            style={{
              fontSize: "3.5rem",
              fontWeight: "800",
              marginBottom: "20px",
              background: "linear-gradient(45deg, #4a90e2, #50e3c2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.2,
            }}
          >
            Добро пожаловать в мир
            <br />
            трехмерных технологий
          </h1>
          <p
            style={{
              fontSize: "1.2rem",
              opacity: 0.9,
              lineHeight: 1.6,
            }}
          >
            Исследуйте возможности 3D графики на современном веб-сайте
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "30px",
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "transform 0.3s ease, background 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateX(10px)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateX(0)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                marginBottom: "15px",
                color: "#4a90e2",
              }}
            >
              Технологии будущего
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              Используем передовые технологии Three.js для создания впечатляющих
              визуальных эффектов прямо в браузере. Никаких плагинов - только
              чистый JavaScript и WebGL.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "transform 0.3s ease, background 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateX(10px)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateX(0)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                marginBottom: "15px",
                color: "#50e3c2",
              }}
            >
              Gatsby и React
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              Сайт построен на Gatsby - современном генераторе статических
              сайтов на React. Это обеспечивает отличную производительность и
              SEO оптимизацию.
            </p>
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              borderRadius: "20px",
              padding: "30px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              transition: "transform 0.3s ease, background 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateX(10px)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateX(0)"
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                marginBottom: "15px",
                color: "#f5a623",
              }}
            >
              Кроссплатформенность
            </h2>
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.6,
                opacity: 0.9,
              }}
            >
              Сайт отлично работает на всех устройствах - от мобильных телефонов
              до настольных компьютеров. Адаптивный дизайн обеспечивает
              комфортный просмотр где угодно.
            </p>
          </div>
        </div>

        <div style={{ marginTop: "50px" }}>
          <a
            href="https://threejs.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              padding: "15px 40px",
              background: "linear-gradient(45deg, #4a90e2, #50e3c2)",
              color: "white",
              textDecoration: "none",
              borderRadius: "30px",
              fontSize: "1.1rem",
              fontWeight: "600",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              boxShadow: "0 10px 20px rgba(74, 144, 226, 0.3)",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={e => {
              e.target.style.transform = "translateY(-2px)"
              e.target.style.boxShadow = "0 15px 30px rgba(74, 144, 226, 0.4)"
            }}
            onMouseLeave={e => {
              e.target.style.transform = "translateY(0)"
              e.target.style.boxShadow = "0 10px 20px rgba(74, 144, 226, 0.3)"
            }}
          >
            Узнать больше о Three.js →
          </a>
        </div>
      </div>
    </>
  )
}

export const Head = () => <Seo title="3D Gatsby сайт" />

export default UsingSSR
