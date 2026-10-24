import { Link } from 'react-router-dom';
import { products } from '../data/products';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

export default function FavoritesPage() {
  const { favorites, t } = useShop();
  const saved = products.filter((product) => favorites.includes(product.id));
  return (
    <main className="page-container favorites-page">
      <div className="breadcrumbs"><Link to="/">Shopy.tn</Link><span>/</span><span>{t('favoritesTitle')}</span></div>
      <div className="catalog-heading"><div><span className="section-kicker">SHOPY / 07</span><h1>{t('favoritesTitle')}</h1></div><span className="result-count">{saved.length} {t('results')}</span></div>
      {saved.length ? <div className="product-grid">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div> : (
        <div className="empty-state"><span className="empty-illustration"><Icon name="heart" size={30} /></span><h2>{t('emptyFavorites')}</h2><p>{t('emptyFavoritesText')}</p><Link className="button button-primary" to="/catalogue">{t('backToShop')} <Icon name="arrow" size={17} /></Link></div>
      )}
    </main>
  );
}
