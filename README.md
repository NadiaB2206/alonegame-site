# Spa Moon Soul — Landing page

Static landing page implementing the Figma design `r1QcQnSCr1TMzVkroK8cWX` (node `1:833`).

## Run

Open `index.html` directly in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit <http://localhost:8000/>.

No build step, no dependencies (fonts loaded via Google Fonts CDN).

## Stack

- Plain HTML5 + CSS3 (CSS Grid + custom properties)
- Google Fonts: Poiret One (display), Outfit (body), Inter (reserve)
- Single page, anchor-based nav (`#accueil`, `#apropos`, `#services`, `#galerie`, `#contact`)

## Design tokens (`style.css` `:root`)

- Background gradient: `#01120e → #465048 → #aba99d`
- Card backgrounds: `#5e655d`, alt `#4a534b`
- Accent / text-shadow: `#6a7c81`
- Text: `#ffffff` / `#fffdfd`
- Card shadow: `10px 4px 16px rgba(0,0,0,0.25)`
- Button shadow: `0 4px 2px rgba(0,0,0,0.25)`

## Assets to provide

The sandbox could not download images from the Figma CDN, so every photo
slot is currently a CSS gradient placeholder. Drop real images into an
`assets/` folder and swap the corresponding CSS rule:

| Slot               | CSS selector            | Suggested filename       |
| ------------------ | ----------------------- | ------------------------ |
| Hero banner        | `.hero-image`           | `assets/hero.jpg`        |
| Signature section  | `.signature-figure`     | `assets/signature.jpg`   |
| Massage card 1     | `.card:nth-child(1) .card-photo` | `assets/massage-1.jpg` |
| Massage card 2     | `.card:nth-child(2) .card-photo` | `assets/massage-2.jpg` |
| Massage card 3     | `.card:nth-child(3) .card-photo` | `assets/massage-3.jpg` |
| Testimonial avatars (×3) | `.testimonial:nth-child(N) .avatar` | `assets/avatar-N.jpg` |

For each, replace the `background: linear-gradient(...)` line with:

```css
background-image: url("assets/hero.jpg");
background-size: cover;
background-position: center;
```

(For `.avatar`, keep `border-radius: 50%` so the photo is masked into a circle.)

## Layout notes

- Responsive: 3-up grids collapse to 1 column below 900px; signature
  section collapses to 1 column below 800px.
- Reference canvas was 1440 × 4465 px; the layout uses `clamp()` for
  fluid type and padding rather than fixed pixel positions.
- "Verbatim" text from the design is preserved including the double
  space in "Soin  Apaisant à la Pierre de Lune", the alternate brand
  "Supa Moon" in Sonia T.'s quote, and the "Magical Supa" copyright.
