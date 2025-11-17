import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-content">
        <div className="hero-image">
          <img src="/hero-photo.jpg" alt="Božkov" />
        </div>
        <div className="hero-text">
          <h2 className="hero-title">BOŽKOV</h2>
          <p className="hero-subtitle">Česká tradice a řemeslná zručnost od roku 1948</p>
          <p className="hero-description">
            Nejprodávanější rum v České republice s ikonickou plachetnicí na etiketě
          </p>
          <a href="#products" className="cta-button">Objevte naše produkty</a>
        </div>
      </div>
    </section>
  )
}
