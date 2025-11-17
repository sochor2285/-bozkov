import Hero from '../components/Hero/Hero'
import ProductList from '../components/Products/ProductList'
import '../App.css'

export default function Homepage() {
  return (
    <>
      <Hero />
      <ProductList />

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
    </>
  )
}
