import { useState } from 'react'
import './App.css'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  const products = [
    {
      name: 'Božkov Original',
      description: 'Vlajková loď značky a ikona tuzemského rumu. S charakteristickou plachetnicí na etiketě od roku 1948.',
      alcohol: '37,5%',
      type: 'Tuzemský rum'
    },
    {
      name: 'Božkov Republica Exclusive',
      description: 'Prémiová směs 8letých rumů z Nikaraguy, Dominikánské republiky, Barbadosu a Jamajky.',
      alcohol: '38%',
      type: 'Karibský rum'
    },
    {
      name: 'Božkov Republica Solera',
      description: 'Vysoce kvalitní rum vyrobený tradiční metodou Solera v Dominikánské republice.',
      alcohol: '38%',
      type: 'Karibský rum'
    },
    {
      name: 'Božkov Republica Honey',
      description: 'Jemný rumový likér s medovou příchutí.',
      alcohol: '35%',
      type: 'Rumový likér'
    },
    {
      name: 'Božkov Republica White',
      description: 'Bílý rum z cukrové třtiny pro milovníky čistých chutí.',
      alcohol: '38%',
      type: 'Bílý rum'
    },
    {
      name: 'Božkov Republica Espresso',
      description: 'Rum s výraznou kávovou příchutí pro jedinečný zážitek.',
      alcohol: '35%',
      type: 'Ochucený rum'
    }
  ]

  return (
    <div className="app">
      <nav className="navbar">
        <div className="nav-container">
          <h1 className="logo">BOŽKOV</h1>
          <ul className="nav-menu">
            <li><a href="#home" onClick={() => setActiveSection('home')}>Domů</a></li>
            <li><a href="#products" onClick={() => setActiveSection('products')}>Produkty</a></li>
            <li><a href="#history" onClick={() => setActiveSection('history')}>Historie</a></li>
          </ul>
        </div>
      </nav>

      <section id="home" className="hero">
        <div className="hero-content">
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

      <section id="products" className="products">
        <div className="container">
          <h2 className="section-title">Naše Produkty</h2>
          <div className="products-grid">
            {products.map((product, index) => (
              <div key={index} className="product-card">
                <div className="product-icon">🥃</div>
                <h3 className="product-name">{product.name}</h3>
                <p className="product-type">{product.type}</p>
                <p className="product-description">{product.description}</p>
                <div className="product-alcohol">{product.alcohol}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="history" className="history">
        <div className="container">
          <h2 className="section-title">Naše Historie</h2>
          <div className="history-content">
            <div className="timeline-item">
              <h3>1948</h3>
              <p>
                Božkov Original byl poprvé uveden na trh z lihovaru Stock v Plzni.
                Od samého začátku zdobí etiketu ikonická plachetnice.
              </p>
            </div>
            <div className="timeline-item">
              <h3>19. století - Tradice</h3>
              <p>
                Tuzemský rum se stal jedním z nejoblíbenějších destilátů v českých zemích.
                Vyrábí se z brambor nebo cukrové řepy a je ochucen rumovými esencemi.
              </p>
            </div>
            <div className="timeline-item">
              <h3>2012</h3>
              <p>
                Rozšíření portfolia o speciální edice včetně autentických karibských rumů,
                čímž značka vstoupila do nové éry.
              </p>
            </div>
            <div className="timeline-item">
              <h3>2018</h3>
              <p>
                Uvedení Božkov Republica Exclusive na český trh - jeden z nejúspěšnějších
                nových produktů v historii společnosti STOCK.
              </p>
            </div>
            <div className="timeline-item">
              <h3>Dnes</h3>
              <p>
                Rum s plachetnicí je nejprodávanějším rumem v České republice a symbolem
                kvality a tradice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; 2024 STOCK Plzeň-Božkov s.r.o. | Vyrobeno v České republice</p>
          <p className="footer-warning">Konzumujte alkohol zodpovědně. Pouze pro osoby 18+</p>
        </div>
      </footer>
    </div>
  )
}

export default App
