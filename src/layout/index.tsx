import { Outlet } from 'react-router-dom'
import Header from './Header'
import Navigation from './Navigation'
import Footer from './Footer'
import Aside from './Aside'

const Layout = () => {
  return (
    <>
      <Header />
      <div className="main-part">
        <section>
          <Navigation />
          <div className="general">
            <div className="detail">
              <Outlet />
            </div>
          </div>
        </section>

        <Aside />

      </div>
      <Footer />
    </>
  )
}

export default Layout
