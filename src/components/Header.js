import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getProductName, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import Icon from './Icon';

export default function Header() {
  const { cart, favorites, language, setLanguage, theme, toggleTheme, t } = useShop();
  const [query, setQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    function closeSearchOnOutsideClick(event) {
      if (!searchRef.current?.contains(event.target)) setSearchOpen(false);
    }
    document.addEventListener('pointerdown', closeSearchOnOutsideClick);
    return () => document.removeEventListener('pointerdown', closeSearchOnOutsideClick);
  }, []);

  const matches = query.trim()
    ? products.filter((product) => [product.name, product.brand, ...Object.values(product.names)].join(' ').toLowerCase().includes(query.trim().toLowerCase())).slice(0, 4)
    : [];

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/catalogue${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
    setSearchOpen(false);
  }

  return (
    <>
      <div className="announcement">{t('promo')} <span>{t('demoLabel')}</span></div>
      <header className="site-header">
        <div className="header-main page-container">
          <button className="icon-button mobile-menu-toggle" aria-label={t('menu')} onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
          <Link className="brand-mark" to="/" aria-label="Shopy.tn accueil">
            <span className="brand-symbol">s</span><span>shopy<span className="brand-dot">.</span><small>tn</small></span>
          </Link>
          <form ref={searchRef} className={`search-box ${searchOpen ? 'search-open' : ''}`} role="search" onSubmit={submitSearch}>
            <Icon name="search" />
            <input
              type="search"
              value={query}
              onFocus={() => setSearchOpen(true)}
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={(event) => { if (event.key === 'Escape') setSearchOpen(false); }}
              placeholder={t('search')}
              aria-label={t('search')}
            />
            {query && <button className="search-clear" type="button" aria-label={t('close')} onClick={() => setQuery('')}><Icon name="close" size={16} /></button>}
            {matches.length > 0 && searchOpen && (
              <div className="search-suggestions">
                {matches.map((product) => (
                  <Link to={`/produit/${product.id}`} key={product.id} className="suggestion">
                    <img src={product.image} alt="" /><span>{getProductName(product, language)}<small>{product.brand}</small></span>
                  </Link>
                ))}
                <button type="submit" className="suggestion-all">{t('seeAll')} <Icon name="arrow" size={16} /></button>
              </div>
            )}
          </form>
          <div className="header-actions">
            <label className="language-picker">
              <span className="sr-only">{t('language')}</span>
              <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('language')}>
                <option value="fr">FR</option><option value="ar">عربي</option><option value="en">EN</option>
              </select>
            </label>
            <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={t('theme')} title={t('theme')}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
            </button>
            <Link className="icon-button action-link" to="/favoris" aria-label={`${t('favorites')} (${favorites.length})`}>
              <Icon name="heart" /><span className="action-label">{t('favorites')}</span>
              {favorites.length > 0 && <b className="count-badge">{favorites.length}</b>}
            </Link>
            <Link className="icon-button action-link cart-action" to="/panier" aria-label={`${t('cart')} (${cart.reduce((sum, item) => sum + item.quantity, 0)})`}>
              <Icon name="bag" /><span className="action-label">{t('cart')}</span>
              {cart.length > 0 && <b className="count-badge">{cart.reduce((sum, item) => sum + item.quantity, 0)}</b>}
            </Link>
          </div>
        </div>
        <nav className={`primary-nav ${menuOpen ? 'nav-open' : ''}`} aria-label={t('quickLinks')}>
          <div className="page-container nav-inner">
            <Link to="/">{t('home')}</Link><Link to="/catalogue">{t('shop')}</Link>
            <Link to="/catalogue?sort=discount">{t('dealsTitle')}</Link>
          <label className="mobile-language-picker">
            <span>{t('language')}</span>
            <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label={t('language')}>
              <option value="fr">Français</option><option value="ar">العربية</option><option value="en">English</option>
            </select>
          </label>
          <span className="nav-tag">{t('demoLabel')}</span>
        </div>
        </nav>
      </header>
    </>
  );
}
