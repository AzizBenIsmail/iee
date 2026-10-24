import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export default function Footer() {
  const { t } = useShop();
  return (
    <footer className="site-footer">
      <div className="page-container footer-grid">
        <div className="footer-brand">
          <Link className="brand-mark footer-logo" to="/"><span className="brand-symbol">s</span><span>shopy<span className="brand-dot">.</span><small>tn</small></span></Link>
          <p>{t('footerText')}</p>
          <span className="demo-pill">{t('demoLabel')}</span>
        </div>
        <div><h3>{t('quickLinks')}</h3><Link to="/catalogue">{t('shop')}</Link><Link to="/favoris">{t('favorites')}</Link><Link to="/panier">{t('cart')}</Link></div>
        <div><h3>{t('help')}</h3><p>{t('supportText')}</p></div>
      </div>
      <div className="footer-bottom page-container"><span>© {new Date().getFullYear()} Shopy.tn · {t('allRights')}</span><span>{t('demoNote')}</span></div>
    </footer>
  );
}
