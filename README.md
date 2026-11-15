# IROJ Móvil - CSJLE 2026 ⚖️📱

Aplicación Web Progresiva (PWA) y Móvil para la consulta interactiva de indicadores del **Índice de Rendimiento de Órganos Jurisdiccionales (IROJ)** de la Corte Superior de Justicia de Lima Este (CSJLE).

---

## 🚀 Características

- 📊 **Consulta Rápida por Filtros**: Búsqueda por Mes de Evaluación, Distrito Judicial, Sede y Dependencia/Juzgado.
- 🎯 **5 KPIs Clave**:
  - Trámite (25%)
  - Año Anterior (25%)
  - Escritos Pendientes (25%)
  - Impugnaciones (15%)
  - Ejecución (10%)
- 🏆 **Cálculo de Puntaje IROJ y Nivel de Cumplimiento**:
  - 🟢 **Óptimo**: Mayor o igual a 80 pts
  - 🟡 **Aceptable**: Entre 60 y 79.99 pts
  - 🟠 **En Riesgo**: Entre 40 y 59.99 pts
  - 🔴 **Crítico**: Menor a 40 pts
- 📶 **100% Offline (PWA)**: Funciona sin conexión a internet gracias al dataset integrado y Service Worker.
- 📱 **Instalable**: Se puede instalar como App nativa en Android e iOS directamente desde el navegador o mediante APK.

---

## 🛠️ Stack Tecnológico

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS v4**
- **Lucide React** (Iconografía)
- **PWA / Service Worker** (Soporte offline)

---

## 💻 Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build
```

---

## ☁️ Despliegue en Vercel

Este proyecto cuenta con `vercel.json` preconfigurado para despliegue automático con 0 configuración:

1. Importar el repositorio `iroj-movil` en [Vercel](https://vercel.com).
2. Framework Preset: **Vite** (detectado automáticamente).
3. Build Command: `npm run build`.
4. Output Directory: `dist`.
5. Clic en **Deploy**.
