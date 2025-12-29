# 🚀 Professional Full-Stack Portfolio | Angular Specialist

[![Angular](https://img.shields.io/badge/Angular-19+-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-green?style=for-the-badge&logo=greensock&logoColor=white)](https://greensock.com/)
[![Tests](https://img.shields.io/badge/Coverage-93%25-brightgreen?style=for-the-badge&logo=jest&logoColor=white)](#-testing--calidad)
[![Performance](https://img.shields.io/badge/Lighthouse-100-orange?style=for-the-badge&logo=lighthouse&logoColor=white)](#-rendimiento-y-core-web-vitals)

Este proyecto no es solo un portafolio; es un **ecosistema de alta ingeniería** desarrollado para demostrar el dominio avanzado del ecosistema Angular moderno, la optimización de renderizado crítico y la entrega de interfaces ultra-fluidas con animaciones de grado cinemático.

---

## 🛠️ Stack Arquitectónico

### **Core Framework & State**

- **Angular 19 (Standalone Architecture):** Arquitectura sin módulos para un árbol de dependencias limpio y un bundle size optimizado.
- **Reactive Programming (RxJS):** Gestión de flujos asíncronos mediante operadores de transformación y manejo de errores para una comunicación resiliente.
- **Typed Reactive Forms:** Validación robusta y tipado estricto en formularios para eliminar errores en tiempo de ejecución.

### **Experiencia de Usuario (UX) & Motion**

- **GSAP (GreenSock Animation Platform):** Motor principal para cálculos de física, paralaje 3D y ScrollTriggers de alta precisión.
- **Glassmorphism Design:** Sistema visual basado en `backdrop-filter`, elevación por capas y bordes dinámicos.
- **Tailwind CSS:** Diseño atómico con optimización de purga de CSS para tiempos de carga instantáneos.

---

## ⚡ Rendimiento y Core Web Vitals

La aplicación está diseñada bajo el estándar de **60 FPS constantes**, optimizando el ciclo de vida de Angular para evitar el bloqueo del hilo principal.

- **Zone.js Optimization (`runOutsideAngular`):** El motor de paralaje y los trackers del mouse se ejecutan fuera de la zona de Angular, reduciendo los ciclos de detección de cambios en un 80%.
- **Estrategia OnPush & Signals:** Uso de `ChangeDetectionStrategy.OnPush` para un renderizado determinista y eficiente.
- **Smart Memory Management:** Sistema de **Animation Scopes** personalizado que garantiza la destrucción de instancias de GSAP y ScrollTriggers al destruir componentes, eliminando memory leaks.
- **Hydration & SSR Ready:** Configuración preparada para renderizado en el servidor, garantizando un First Contentful Paint (FCP) extremadamente bajo.

---

## 🧪 Testing y Calidad

El proyecto mantiene un estándar de calidad corporativo, asegurando que cada componente sea robusto y escalable.

- **Coverage Actual:** `93.4%` 🚀
- **Unit Testing:** Cobertura total de servicios de lógica, pipes y utilitarios.
- **Integration Testing:** Validación de flujos de usuario y comunicación entre componentes.
- **Mocking Patterns:** Implementación de mocks para APIs de terceros (como EmailJS) y servicios de plataforma.

```bash
# Ejecutar la suite completa de pruebas
npm run test:coverage



src/app/
├── core/             # Singletons & Logica Global: Services, Guards, Interceptors, Types
│   ├── services/     # AnimationService, ZoneService, PlatformService (SSR detection)
│   └── types/        # Modelos de datos e interfaces estrictas
├── shared/           # UI Components & Directivas Reutilizables
│   ├── components/   # Card, Toast Notification, Skeleton Loader
│   ├── directives/   # GlassParallax (Custom 3D Engine)
│   └── animations/   # Definiciones globales de GSAP
└── features/         # Vistas principales (Home, Projects, Contact)

```

Features de Calidad

1. Glass Parallax Engine
   Una directiva personalizada que calcula la posición del cursor respecto al centro del elemento, aplicando transformaciones matriciales 3D en tiempo real con suavizado inercial.

2. Adaptive Scroll & Mobile Viewport
   Sistema de detección de altura dinámica que recalcula los puntos de revelado (ScrollTrigger.refresh()) para adaptarse a los cambios de altura en navegadores móviles (address bar shift).

3. Form Engine & EmailJS
   Integración de servicios de mensajería con feedback visual neon. Implementa una capa de abstracción sobre EmailJS que permite el manejo de cuotas, reintentos y notificaciones tipo Toast en tiempo real.

4. Zero-Layout-Shift Skeleton Architecture
   Placeholder dinámico que previene el salto de contenido (CLS) durante la carga asíncrona de proyectos desde el servicio.

🚀 Instalación
Clonar el repositorio.

Ejecutar npm install.

Iniciar el entorno de desarrollo con ng serve.

Desarrollado con ❤️ por Mariano Santos Full-Stack Developer & Angular Specialist
