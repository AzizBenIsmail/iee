import { Link } from 'react-router-dom';
import { getProductName, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import Icon from '../components/Icon';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, t, language } = useShop();
  const lines = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product);
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 150 ? 0 : 8;

  if (!lines.length) return (
    <main className="page-container cart-page">
      <div className="breadcrumbs"><Link to="/">Shopy.tn</Link><span>/</span><span>{t('cartTitle')}</span></div>
      <div className="empty-state cart-empty"><span className="empty-illustration"><Icon name="bag" size={30} /></span><h1>{t('emptyCart')}</h1><p>{t('emptyCartText')}</p><Link className="button button-primary" to="/catalogue">{t('backToShop')} <Icon name="arrow" size={17} /></Link></div>
    </main>
  );

  return (
    <main className="page-container cart-page">
      <div className="breadcrumbs"><Link to="/">Shopy.tn</Link><span>/</span><span>{t('cartTitle')}</span></div>
      <div className="catalog-heading"><div><span className="section-kicker">SHOPY / 06</span><h1>{t('cartTitle')}</h1></div><span className="result-count">{lines.reduce((sum, item) => sum + item.quantity, 0)} {t('results')}</span></div>
      <div className="cart-layout">
        <div className="cart-lines">
          {lines.map(({ id, quantity, product }) => (
            <article className="cart-line" key={id}>
              <Link to={`/produit/${id}`} className="cart-line-image"><img src={product.image} alt={getProductName(product, language)} /></Link>
              <div className="cart-line-info"><span className="product-brand">{product.brand}</span><Link to={`/produit/${id}`} className="product-name">{getProductName(product, language)}</Link><span className="cart-unit-price">{formatPrice(product.price, language)}</span></div>
              <div className="quantity-control" aria-label={t('quantity')}><button aria-label={`${t('quantity')} − ${getProductName(product, language)}`} onClick={() => updateQuantity(id, quantity - 1)}>−</button><span>{quantity}</span><button aria-label={`${t('quantity')} + ${getProductName(product, language)}`} onClick={() => updateQuantity(id, quantity + 1)}>+</button></div>
              <strong className="line-total">{formatPrice(product.price * quantity, language)}</strong>
              <button className="remove-button" aria-label={`${t('remove')} ${getProductName(product, language)}`} onClick={() => removeFromCart(id)}><Icon name="close" size={18} /></button>
            </article>
          ))}
          <Link className="text-link cart-continue" to="/catalogue"><Icon name="arrow" size={17} /> {t('backToShop')}</Link>
        </div>
        <aside className="order-summary"><h2>{t('total')}</h2><div className="summary-row"><span>{t('subtotal')}</span><strong>{formatPrice(subtotal, language)}</strong></div><div className="summary-row"><span>{t('shipping')}</span><strong>{delivery ? formatPrice(delivery, language) : t('free')}</strong></div><p className="shipping-note">{t('shippingNote')}</p><div className="summary-total"><span>{t('total')}</span><strong>{formatPrice(subtotal + delivery, language)}</strong></div><Link className="button button-primary checkout-button" to="/checkout">{t('checkout')} <Icon name="arrow" size={17} /></Link><p className="summary-disclaimer">{t('demoCheckoutNotice')}</p></aside>
      </div>
    </main>
  );
}
