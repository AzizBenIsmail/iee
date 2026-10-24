import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage';
import CheckoutPage from './pages/CheckoutPage';
import './App.css';

function RouteContent() {
  const { toast, t } = useShop();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">{t('home')}</a>
      <Header />
      <div id="main-content" tabIndex="-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CatalogPage />} />
          <Route path="/produit/:id" element={<ProductPage />} />
          <Route path="/panier" element={<CartPage />} />
          <Route path="/favoris" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<main className="page-container not-found"><h1>{t('noResults')}</h1><Link className="button button-primary" to="/">{t('backHome')}</Link></main>} />
        </Routes>
      </div>
      <Footer />
      {toast && <div className="toast-message" role="status" aria-live="polite">{toast}</div>}
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <RouteContent />
      </BrowserRouter>
    </ShopProvider>
  );
}
