# Identidad Visual - Impacta+

| **Versión** | 2.0 |
|-------------|-----|
| **Fecha** | 4 de abril de 2026 |
| **Estado** | En desarrollo |

---

### 1.1 Colores Principales
| Color | Nombre | HEX | RGB | HSL | Uso |
|-------|--------|-----|-----|-----|-----|
| ![Negro](https://via.placeholder.com/50/000000/000000) | **Negro Base** | `#000000` | rgb(0, 0, 0) | hsl(0, 0%, 0%) | Fondos principales, texto oscuro |
| ![Blanco](https://via.placeholder.com/50/FFFFFF/FFFFFF) | **Blanco Puro** | `#FFFFFF` | rgb(255, 255, 255) | hsl(0, 0%, 100%) | Texto principal, iconos, contrastes |
| ![Azul Impacta](https://via.placeholder.com/50/00A8FF/00A8FF) | **Azul Impacta** | `#00A8FF` | rgb(0, 168, 255) | hsl(200°, 100%, 50%) | Color primario, CTAs, enlaces |
| ![Verde Restore](https://via.placeholder.com/50/00D4AA/00D4AA) | **Verde Restore** | `#00D4AA` | rgb(0, 212, 170) | hsl(168°, 100%, 42%) | Acentos, éxitos, símbolo + |

### 1.2 Colores Secundarios (Derivados)
| Color | Nombre | HEX | Uso |
|-------|--------|-----|-----|
| ![Azul Oscuro](https://via.placeholder.com/50/0077B6/0077B6) | Azul Profundo | `#0077B6` | Hover azul, estados activos |
| ![Azul Claro](https://via.placeholder.com/50/80D8FF/80D8FF) | Azul Cielo | `#80D8FF` | Fondos suaves, highlights |
| ![Verde Oscuro](https://via.placeholder.com/50/00A896/00A896) | Verde Bosque | `#00A896` | Hover verde, estados secundarios |
| ![Verde Claro](https://via.placeholder.com/50/80FFDD/80FFDD) | Verde Menta | `#80FFDD` | Fondos ecológicos, badges |
| ![Gris Oscuro](https://via.placeholder.com/50/1A1A1A/1A1A1A) | Gris Carbón | `#1A1A1A` | Fondos alternativos |
| ![Gris Medio](https://via.placeholder.com/50/4A4A4A/4A4A4A) | Gris Piedra | `#4A4A4A` | Texto secundario |
| ![Gris Claro](https://via.placeholder.com/50/E0E0E0/E0E0E0) | Gris Nube | `#E0E0E0` | Bordes, separadores |

---

### 2.1 Fuente Principal
**Inter** (Google Fonts)
- Moderna, legible, optimizada para UI
- Pesos: 300, 400, 500, 600, 700

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### 2.2 Fuente Secundaria (Títulos/Logo)
**Montserrat** (Google Fonts)
- Impactante para títulos y branding
- Pesos: 600, 700, 800

```css
font-family: 'Montserrat', sans-serif;
```

---

### 4.1 Border Radius
| Token | Valor | Uso |
|-------|-------|-----|
| `--radius-sm` | 4px | Botones pequeños, inputs |
| `--radius-md` | 8px | Botones estándar, cards |
| `--radius-lg" | 12px | Cards grandes, modales |
| `--radius-xl` | 16px | Contenedores destacados |
| `--radius-full` | 9999px | Avatares, badges, pills |

---

### 5.1 Botones
```css
/* Botón Primario */
.btn-primary {
  background: #00A8FF;
  color: #FFFFFF;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
}
```

---

### 6.1 Logo
El logo de Impacta+ consiste en:
- Texto "ONG" en blanco
- "IMPACTA" en Azul Impacta (#00A8FF)
- Símbolo "+" en Verde Restore (#00D4AA) con efecto brush
- Tagline "Restaurando Nuestro Planeta" en blanco

---

*Documento de diseño para el sistema SaaS de ONG Impacta+*
