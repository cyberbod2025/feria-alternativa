import { Stand } from "../types";

export const mockStands: Stand[] = [
  {
    id: "stand-01",
    name: "Volumen: pirámide vs prisma",
    group: "3A",
    tema: "Matemáticas",
    zone: "Norte",
    description:
      "Demostración práctica de la relación de volumen entre prismas y pirámides de igual base y altura usando líquidos o arena.",
    objective:
      "Comprender que el volumen de una pirámide es un tercio del volumen de un prisma con la misma base y altura.",
    status: "active",
    currentVisitors: 2,
    totalVisitors: 45,
    totalPoints: 0,
    qrSlug: "vol-piramide-prisma",
    trivia: [
      {
        id: "t1",
        question: "¿Cuántas pirámides se necesitan para llenar el prisma?",
        options: ["1", "2", "3", "4"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "stand-02",
    name: "Suma de ángulos del triángulo = 180°",
    group: "3A",
    tema: "Matemáticas",
    zone: "Norte",
    description:
      "Recorte interactivo de las puntas de un triángulo de papel para alinearlas y demostrar que forman una línea recta.",
    status: "recommended",
    currentVisitors: 0,
    totalVisitors: 30,
    totalPoints: 0,
    qrSlug: "angulos-triangulo",
    trivia: [
      {
        id: "t2",
        question: "¿Cuánto suman siempre los ángulos internos de un triángulo?",
        options: ["90°", "180°", "270°", "360°"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "stand-03",
    name: "Multiplicación de fracciones con acetatos",
    group: "2B",
    tema: "Matemáticas",
    zone: "Centro",
    description:
      "Uso de láminas superpuestas para visualizar cómo se multiplican las áreas representadas por fracciones.",
    status: "active",
    currentVisitors: 4,
    totalVisitors: 60,
    qrSlug: "fracciones-acetatos",
    trivia: [
      {
        id: "t3",
        question: "Al multiplicar 1/2 por 1/2, ¿qué porción de la unidad original obtenemos?",
        options: ["1/4", "1/2", "1", "2"],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: "stand-04",
    name: "Balanzas y ecuaciones",
    group: "1A",
    tema: "Matemáticas",
    zone: "Centro",
    description:
      'Uso de una balanza real con pesos para enseñar a despejar la "X" manteniendo el equilibrio.',
    status: "saturated",
    currentVisitors: 8,
    totalVisitors: 120,
    qrSlug: "balanzas-ecuaciones",
    trivia: [
      {
        id: "t4",
        question: "Si quitamos un objeto de un lado de la balanza en equilibrio, ¿qué debemos hacer para mantener la igualdad?",
        options: ["Agregar el doble", "No hacer nada", "Quitar el mismo peso del otro lado", "Mover la balanza"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "stand-05",
    name: "Álgebra tiles",
    group: "2A",
    tema: "Matemáticas",
    zone: "Centro",
    description:
      "Manipulación de cuadrículas algebraicas para factorizar polinomios de forma visual.",
    status: "active",
    currentVisitors: 3,
    totalVisitors: 55,
    qrSlug: "algebra-tiles",
    trivia: [
      {
        id: "t5",
        question: "¿Qué representa visualmente la suma de las áreas de estas fichas?",
        options: ["Un polinomio", "Siempre cero", "Un prisma", "La derivada"],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: "stand-06",
    name: "Cuerpos de revolución",
    group: "3B",
    tema: "Matemáticas",
    zone: "Oeste",
    description:
      "Motor con figuras bidimensionales acopladas. Al girar rápidamente, revelan formas tridimensionales.",
    status: "active",
    currentVisitors: 5,
    totalVisitors: 80,
    qrSlug: "cuerpos-revolucion",
    trivia: [
      {
        id: "t6",
        question: "¿Qué sólido de revolución se forma al hacer girar un rectángulo sobre uno de sus lados?",
        options: ["Cono", "Esfera", "Cilindro", "Toro"],
        correctOptionIndex: 2,
      },
    ],
  },
  {
    id: "stand-07",
    name: "Ilusiones ópticas geométricas",
    group: "1B",
    tema: "Matemáticas",
    zone: "Este",
    description:
      "Exposición interactiva sobre engaños visuales y cómo la geometría nos ayuda a entender la realidad.",
    status: "active",
    currentVisitors: 1,
    totalVisitors: 40,
    qrSlug: "ilusiones-opticas",
    trivia: [
      {
        id: "t7",
        question: "¿Qué causa principalmente estas ilusiones geométricas?",
        options: ["La relatividad general", "El cerebro asumiendo patrones perspectivos", "Magnetismo", "Defectos en el material"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "stand-08",
    name: "Torre de Hanói",
    group: "1C",
    tema: "Matemáticas",
    zone: "Este",
    description:
      "Juego de discos de diferentes tamaños con el objetivo de pasarlos a otra columna aplicando recursividad.",
    status: "recommended",
    currentVisitors: 0,
    totalVisitors: 25,
    qrSlug: "torre-hanoi",
    trivia: [
      {
        id: "t8",
        question: "¿Cuál es el número mínimo de movimientos para 3 discos?",
        options: ["5", "7", "9", "11"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "stand-09",
    name: "Campana de Gauss",
    group: "3C",
    tema: "Matemáticas",
    zone: "Oeste",
    description:
      "Máquina de Galton (Tablero de Galton) que simula la distribución normal al dejar caer pequeñas bolas.",
    status: "active",
    currentVisitors: 3,
    totalVisitors: 75,
    qrSlug: "campana-gauss",
    trivia: [
      {
        id: "t9",
        question: "¿A qué curva o distribución se aproxima el patrón de caída de las bolas?",
        options: ["Distribución binomial/normal", "La serie de Fibonacci", "Distribución cúbica", "Una recta constante"],
        correctOptionIndex: 0,
      },
    ],
  },
  {
    id: "stand-10",
    name: "Ventana de Ames",
    group: "2C",
    tema: "Física/Mate",
    zone: "Sur",
    description:
      "Una ventana trapezoidal giratoria que crea una poderosa ilusión óptica de oscilación en lugar de giro.",
    status: "saturated",
    currentVisitors: 9,
    totalVisitors: 150,
    qrSlug: "ventana-ames",
    trivia: [
      {
        id: "t10",
        question: "¿Por qué nuestra mente percibe que oscila de un lado a otro?",
        options: ["Porque la rotación es tan rápida que confunde la visión", "Nuestro cerebro asume por costumbre que las ventanas son rectangulares", "Efectos cuánticos de la luz", "Solo gira, no genera ilusión"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "stand-11",
    name: "Müller-Lyer",
    group: "1D",
    tema: "Matemáticas",
    zone: "Sur",
    description:
      "Estudio de la percepción de longitud geométrica utilizando flechas que parecen de distinto tamaño.",
    status: "active",
    currentVisitors: 2,
    totalVisitors: 35,
    qrSlug: "muller-lyer",
    trivia: [
      {
        id: "t11",
        question: "¿Qué son en realidad las líneas de la famosa ilusión de Müller-Lyer?",
        options: ["Una más corta que la otra", "Del mismo tamaño", "Líneas elásticas de goma", "Forman un triángulo equilátero"],
        correctOptionIndex: 1,
      },
    ],
  },
  {
    id: "stand-12",
    name: "Transformaciones con mosaicos",
    group: "3A",
    tema: "Matemáticas",
    zone: "Norte",
    description:
      "Exhibición de teselaciones inspiradas en Escher usando rotación, reflexión y traslación.",
    status: "active",
    currentVisitors: 4,
    totalVisitors: 65,
    qrSlug: "mosaicos-geometricos",
    trivia: [
      {
        id: "t12",
        question: "¿Qué tipo de transformación consiste en deslizar una figura sin girarla ni voltearla?",
        options: ["Rotación", "Reflexión", "Traslación", "Simetría"],
        correctOptionIndex: 2,
      },
    ],
  },
];
