# HARWARDMINIPROJECT

A static multi-page website built with HTML and CSS. Each page has its own CSS file and also includes `base.css` for shared/global styles.

## Quick overview

- **Tech stack:** HTML + CSS
- **Structure:** Separate HTML pages with page-specific CSS and shared styles in `base.css`
- **Assets:** Images organized by page in the `Assets/` directory

## Pages and ownership

### Samarth (150096725148)
- **Shared** → `base.css` (included in every page for header and footer)
- **Index** → `index.html` + `index.css`
- **Community** → `community.html` + `community.css`
- **Programs & Events** → **CSS only** (`programs.css`)

### Ashish (150096725109)
- **College** → `college.html` + `college.css`
- **Graduate Schools** → `graduate.html` + `graduate.css`
- **Programs & Events** → **HTML only** (`programs.html`)

### Saad (150096725112)
- **Community Login** → `comlogin.html` + `comlogin.css`
- **Register** → `register.html` + `register.css`
- **Images allocation** → See `Assets/` tree below


## Stylesheet usage

- `base.css` contains global styles shared by every page.
- Each page has its own CSS file for page-specific layout and visuals:
  - `index.css`
  - `community.css`
  - `college.css`
  - `graduate.css`
  - `programs.css`
  - `comlogin.css`
  - `register.css`

## File structure

```
HARWARDMINIPROJECT/
├── base.css (main css)
├── college.css (College)
├── college.html (College)
├── comlogin.css (Community Login)
├── comlogin.html (Community Login)
├── community.css (Community)
├── community.html (Community)
├── graduate.css (Graduate)
├── graduate.html (Graduate)
├── index.css (Home)
├── index.html (Home)
├── programs.css (Programs and Events)
├── programs.html (Programs and Events)
├── register.css (Register)
├── register.html (Register)
└── Assets/ (Images)
    ├── BG.jpeg
    ├── LOGO.avif
    ├── favicon.png
    ├── college/
    │   ├── 1.avif
    │   ├── 2.avif
    │   └── 3.avif
    ├── community/
    │   └── 1.jpeg
    ├── graduate/
    │   ├── 1.avif
    │   ├── 2.avif
    │   ├── 3.avif
    │   ├── 4.avif
    │   ├── 5.avif
    │   ├── 6.avif
    │   └── 7.avif
    ├── index/
    │   ├── 1.avif
    │   ├── 2.avif
    │   ├── 3.avif
    │   ├── 4.avif
    │   ├── 5.avif
    │   ├── 6.avif
    │   ├── 7.avif
    │   └── 8.avif
    └── programs/
        ├── 1.avif
        ├── 2.avif
        ├── 3.avif
        ├── 4.avif
        ├── 5.avif
        ├── 6.avif
        ├── 7.avif
        ├── 8.avif
        ├── 9.avif
        ├── 10.avif
        ├── 11.avif
        ├── 12.avif
        ├── 13.avif
        ├── 14.avif
        ├── 15.avif
        ├── 16.avif
        ├── 17.avif
        ├── 18.avif
        ├── 19.avif
        ├── 20.avif
        └── 21.avif
```

## Future Maintenance

- All HTML pages should link to `base.css` plus their respective page CSS.
- The `Assets/` folder keeps images grouped per page for easy maintenance.

