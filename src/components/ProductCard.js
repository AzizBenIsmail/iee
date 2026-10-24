import { Link } from 'react-router-dom';
import { getDiscount, getProductName } from '../data/products';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import Icon from './Icon';

export default function ProductCard({ product }) {
  const { addToCart, favorites, toggleFavorite, t, language } = useShop();
  const saved = favorites.includes(product.id);
  const name = getProductName(product, language);

  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <Link to={`/produit/${product.id}`} className="product-image-link" aria-label={`${t('details')}: ${name}`}>
          <img className="product-image" src={product.image} alt={name} loading="lazy" />
        </Link>
        <span className="sale-badge">−{getDiscount(product)}%</span>
        <button
          className={`favorite-button ${saved ? 'is-saved' : ''}`}
          aria-label={saved ? `${t('remove')} ${name} ${t('favorites')}` : `${t('favorites')}: ${name}`}
          aria-pressed={saved}
          onClick={() => toggleFavorite(product.id)}
        ><Icon name="heart" size={18} /></button>
      </div>
      <div className="product-card-content">
        <span className="product-brand">{product.brand}</span>
        <Link to={`/produit/${product.id}`} className="product-name">{name}</Link>
        <div className="product-prices">
          <strong>{formatPrice(product.price, language)}</strong>
          <del>{formatPrice(product.originalPrice, language)}</del>
        </div>
        <button className="add-button" onClick={() => addToCart(product.id)} disabled={product.stock === 0}>
          <Icon name="bag" size={16} /> {t('addToCart')}
        </button>
      </div>
    </article>
  );
}
