import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getProductName, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import { formatPrice } from '../utils/format';
import Icon from '../components/Icon';

export default function CheckoutPage() {
  const { cart, t, language } = useShop();
  const [complete, setComplete] = useState(false);
  const lines = cart.map((item) => ({ ...item, product: products.find((product) => product.id === item.id) })).filter((item) => item.product);
  const subtotal = lines.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 150 ? 0 : 8;

  if (!lines.length && !complete) return <Navigate to="/panier" replace />;
  if (complete) return (
    <main className="page-container checkout-page">
      <div className="empty-state checkout-complete"><span className="success-mark"><Icon name="check" size={30} /></span><h1>{t('demoComplete')}</h1><p>{t('demoCompleteText')}</p><Link className="button button-primary" to="/">{t('backHome')}</Link></div>
    </main>
  );

  return (
    <main className="page-container checkout-page">
      <div className="breadcrumbs"><Link to="/">Shopy.tn</Link><span>/</span><Link to="/panier">{t('cartTitle')}</Link><span>/</span><span>{t('deliveryTitle')}</span></div>
      <div className="catalog-heading"><div><span className="section-kicker">SHOPY / 08</span><h1>{t('deliveryTitle')}</h1><p>{t('deliverySubtitle')}</p></div></div>
      <div className="checkout-layout">
        <form className="delivery-form" onSubmit={(event) => { event.preventDefault(); setComplete(true); }}>
          <div className="form-grid">
            <label>{t('fullName')}<input name="name" autoComplete="name" required maxLength="100" /></label>
            <label>{t('phone')}<input name="phone" type="tel" autoComplete="tel" required pattern={'\\+?[0-9 ]{8,18}'} /></label>
            <label className="field-wide">{t('email')}<input name="email" type="email" autoComplete="email" /></label>
            <label className="field-wide">{t('address')}<input name="address" autoComplete="street-address" required maxLength="180" /></label>
            <label>{t('city')}<input name="city" autoComplete="address-level2" required maxLength="80" /></label>
            <label className="field-wide">{t('notes')}<textarea name="notes" rows="3" maxLength="300" /></label>
          </div>
          <p className="demo-alert"><span>i</span>{t('demoCheckoutNotice')}</p>
          <button className="button button-primary" type="submit">{t('placeOrder')} <Icon name="arrow" size={17} /></button>
        </form>
        <aside className="order-summary checkout-summary"><h2>{t('cartTitle')}</h2>
          {lines.map(({ id, quantity, product }) => <div className="checkout-line" key={id}><img src={product.image} alt="" /><span>{getProductName(product, language)}<small>× {quantity}</small></span><strong>{formatPrice(product.price * quantity, language)}</strong></div>)}
          <div className="summary-row"><span>{t('subtotal')}</span><strong>{formatPrice(subtotal, language)}</strong></div><div className="summary-row"><span>{t('shipping')}</span><strong>{delivery ? formatPrice(delivery, language) : t('free')}</strong></div><div className="summary-total"><span>{t('total')}</span><strong>{formatPrice(subtotal + delivery, language)}</strong></div>
        </aside>
      </div>
    </main>
  );
}
