# IROJ Móvil - ODANC · CSJLE 2026 ⚖️📱

Aplicación Web Progresiva (PWA) y Móvil para la consulta interactiva de indicadores del **Índice de Rendimiento de Órganos Jurisdiccionales (IROJ)** de la Corte Superior de Justicia de Lima Este.

---

## 📲 Descargar App Nativa para Android (APK)

Puedes descargar e instalar la versión nativa directamente desde este repositorio:
👉 **[Descargar IROJ_CSJLE_2026.apk (Clic aquí)](./IROJ_CSJLE_2026.apk)**
*(Tamaño: ~130 KB | Válido para Android 7.0 a Android 16 | Firmado digitalmente v2 + v3)*

---

## 🚀 Características Principales

- 📊 **Dashboard Ejecutivo**: Resumen general, media distrital y distribución por semáforo de riesgo.
- 🎯 **5 KPIs Clave Ponderados Oficiales**:
  - **Trámite** (25%)
  - **Año Anterior** (25%)
  - **Escritos Pendientes** (25%)
  - **Impugnaciones** (15%)
  - **Ejecución** (10%)
- 🏆 **Ranking de Atención Prioritaria**: Lista de órganos de mayor riesgo IROJ vs órganos de desempeño óptimo.
- 🔍 **Buscador Predictivo Flotante**: Búsqueda instantánea en tiempo real por Órgano, NDEP, Sede o Distrito.
- 🗂️ **Tarjetas Bento con Accordion Drawer**: Desglose con valores numéricos reales y evolución mes a mes (Marzo, Mayo, Agosto, Octubre).
- 📶 **100% Offline (PWA)**: Funciona sin internet ni VPN institucional gracias a su Service Worker y dataset precalculado.

---

## 🛠️ Stack Tecnológico

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS v4**
- **Lucide React** (Iconografía móvil)
- **PWA Service Worker** (Caché offline de alta velocidad)

---

## ☁️ Despliegue en Vercel

Configurado con `vercel.json` para despliegue sin configuración:
- Framework: **Vite**
- Build: `npm run build`
- Output: `dist`
