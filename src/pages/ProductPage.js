import { Link, useParams } from 'react-router-dom';
import { getDiscount, getProductName, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

export default function ProductPage() {
  const { id } = useParams();
  const { addToCart, favorites, toggleFavorite, t, language } = useShop();
  const product = products.find((item) => item.id === id);
  if (!product) return <main className="page-container not-found"><h1>{t('noResults')}</h1><Link className="button button-primary" to="/catalogue">{t('backToShop')}</Link></main>;

  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const saved = favorites.includes(product.id);
  const name = getProductName(product, language);
  return (
    <main className="page-container product-page">
      <div className="breadcrumbs"><Link to="/">Shopy.tn</Link><span>/</span><Link to={`/catalogue?category=${product.category}`}>{t(`category_${product.category}`)}</Link><span>/</span><span>{name}</span></div>
      <section className="product-detail">
        <div className="detail-image"><img src={product.image} alt={name} /><span className="sale-badge">−{getDiscount(product)}%</span></div>
        <div className="detail-copy">
          <span className="product-brand">{product.brand}</span><h1>{name}</h1>
          <div className="detail-prices"><strong>{formatPrice(product.price, language)}</strong><del>{formatPrice(product.originalPrice, language)}</del><span>−{getDiscount(product)}% {t('discount')}</span></div>
          <div className={`stock-status ${product.stock > 0 ? '' : 'out-of-stock'}`}><i />{product.stock > 0 ? (product.stock < 6 ? t('stockLimited') : t('stockAvailable')) : t('stockUnavailable')}</div>
          <h2>{t('description')}</h2><p className="detail-description">{product.description[language]}</p>
          <div className="detail-actions"><button className="button button-primary" disabled={!product.stock} onClick={() => addToCart(product.id)}><Icon name="bag" />{t('addToCart')}</button><button className={`button button-outline ${saved ? 'is-saved' : ''}`} aria-pressed={saved} onClick={() => toggleFavorite(product.id)}><Icon name="heart" />{t('favorites')}</button></div>
          <p className="detail-demo">{t('demoNote')}</p>
        </div>
      </section>
      {related.length > 0 && <section className="section detail-related"><div className="section-heading"><div><span className="section-kicker">SHOPY / 05</span><h2>{t('popular')}</h2></div><Link className="text-link" to={`/catalogue?category=${product.category}`}>{t('seeAll')} <Icon name="arrow" size={17} /></Link></div><div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>}
    </main>
  );
}
