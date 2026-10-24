import { Link } from 'react-router-dom';
import { categories, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

export default function HomePage() {
  const { t } = useShop();
  const [heroFirst, heroSecond] = t('heroTitle').split('\n');
  const featured = [...products].sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price)).slice(0, 4);
  const newArrivals = products.filter((product) => product.isNew).slice(0, 4);
  const popularProducts = products.filter((product) => product.isPopular);
  const categoryImages = ['photo-1498049794561-7780e7231661', 'photo-1616486338812-3dadae4b4ace', 'photo-1596462502278-27bfdc403348', 'photo-1483985988355-763728e1935b', 'photo-1523275335684-37898b6baf30', 'photo-1570222094114-d054a817e56b'];

  return (
    <main>
      <section className="hero-section">
        <div className="page-container hero-inner">
          <div className="hero-copy">
            <span className="eyebrow"><span className="eyebrow-dot" />{t('heroEyebrow')}</span>
            <h1>{heroFirst}<br />{heroSecond}</h1>
            <p>{t('heroText')}</p>
            <Link className="button button-primary" to="/catalogue?sort=discount">{t('shopDeals')} <Icon name="arrow" size={18} /></Link>
            <span className="hero-footnote">{t('demoNote')}</span>
          </div>
          <div className="hero-visual">
            <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1000&q=88" alt="" />
            <div className="hero-sticker"><span>−38%</span><small>{t('discount')}</small></div>
            <div className="hero-caption"><span>SHOPY SELECT</span><strong>La trouvaille<br />du moment.</strong></div>
          </div>
          <div className="hero-index"><span>01</span><i />03</div>
        </div>
      </section>

      <section className="section page-container categories-section">
        <div className="section-heading"><div><span className="section-kicker">SHOPY / 01</span><h2>{t('categoriesTitle')}</h2><p>{t('categoriesSubtitle')}</p></div><Link className="text-link" to="/catalogue">{t('seeAll')} <Icon name="arrow" size={17} /></Link></div>
        <div className="category-grid">
          {categories.map((category, index) => (
            <Link className="category-card" to={`/catalogue?category=${category.id}`} key={category.id}>
              <img src={`https://images.unsplash.com/${categoryImages[index]}?auto=format&fit=crop&w=600&q=78`} alt="" loading="lazy" />
              <span className="category-overlay" />
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{t(`category_${category.id}`)}</span>
              <span className="category-arrow"><Icon name="arrow" size={17} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section deals-section">
        <div className="page-container">
          <div className="section-heading"><div><span className="section-kicker">SHOPY / 02</span><h2>{t('dealsTitle')}</h2><p>{t('dealsSubtitle')}</p></div><Link className="text-link" to="/catalogue?sort=discount">{t('seeAll')} <Icon name="arrow" size={17} /></Link></div>
          <div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="section page-container arrivals-section">
        <div className="section-heading"><div><span className="section-kicker">SHOPY / 03</span><h2>{t('newTitle')}</h2><p>{t('newSubtitle')}</p></div><Link className="text-link" to="/catalogue">{t('seeAll')} <Icon name="arrow" size={17} /></Link></div>
        <div className="product-grid">{newArrivals.map((product) => <ProductCard key={product.id} product={product} />)}</div>
      </section>

      <section className="section deals-section">
        <div className="page-container">
          <div className="section-heading"><div><span className="section-kicker">SHOPY / 04</span><h2>{t('popular')}</h2><p>{t('popularSubtitle')}</p></div><Link className="text-link" to="/catalogue">{t('seeAll')} <Icon name="arrow" size={17} /></Link></div>
          <div className="product-grid">{popularProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
      </section>

      <section className="promise-band"><div className="page-container promise-inner"><span className="promise-mark">✳</span><div><strong>{t('tagline')}</strong><p>{t('demoNote')}</p></div><Link to="/catalogue" className="button button-light">{t('shop')} <Icon name="arrow" size={17} /></Link></div></section>
    </main>
  );
}
