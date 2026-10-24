import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { categories, getDiscount, products } from '../data/products';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

export default function CatalogPage() {
  const { t } = useShop();
  const [params, setParams] = useSearchParams();
  const query = params.get('q') || '';
  const category = params.get('category') || '';
  const brand = params.get('brand') || '';
  const min = params.get('min') || '';
  const max = params.get('max') || '';
  const sort = params.get('sort') || '';
  const stockOnly = params.get('stock') === 'true';
  const brands = [...new Set(products.map((product) => product.brand))].sort();

  function update(key, value) {
    const next = new URLSearchParams(params);
    if (!value) next.delete(key);
    else next.set(key, value);
    setParams(next);
  }

  const filtered = useMemo(() => {
    const result = products.filter((product) => {
      const searchableText = [product.name, product.brand, ...Object.values(product.names)].join(' ').toLowerCase();
      const matchesQuery = !query || searchableText.includes(query.toLowerCase());
      return matchesQuery
        && (!category || product.category === category)
        && (!brand || product.brand === brand)
        && (!min || product.price >= Number(min))
        && (!max || product.price <= Number(max))
        && (!stockOnly || product.stock > 0);
    });
    if (sort === 'discount') result.sort((a, b) => getDiscount(b) - getDiscount(a));
    if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
    return result;
  }, [query, category, brand, min, max, sort, stockOnly]);

  function clearFilters() { setParams(query ? { q: query } : {}); }

  return (
    <main className="page-container catalog-page">
      <div className="breadcrumbs"><Link to="/">Shopy.tn</Link><span>/</span><span>{t('shop')}</span></div>
      <div className="catalog-heading"><div><span className="section-kicker">SHOPY / 04</span><h1>{category ? t(`category_${category}`) : t('catalogTitle')}</h1><p>{query ? `${t('searchResults')} “${query}”` : t('catalogSubtitle')}</p></div><span className="result-count">{filtered.length} {t('results')}</span></div>
      <div className="catalog-layout">
        <aside className="filter-panel">
          <h2>{t('filters')}</h2>
          <label className="filter-label">{t('category')}
            <select value={category} onChange={(event) => update('category', event.target.value)}>
              <option value="">{t('allCategories')}</option>
              {categories.map((item) => <option value={item.id} key={item.id}>{t(`category_${item.id}`)}</option>)}
            </select>
          </label>
          <label className="filter-label">{t('brand')}
            <select value={brand} onChange={(event) => update('brand', event.target.value)}>
              <option value="">{t('allBrands')}</option>{brands.map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <fieldset className="price-filter"><legend>{t('price')} (DT)</legend>
            <div><label><span className="sr-only">{t('minPrice')}</span><input type="number" min="0" placeholder={t('minPrice')} value={min} onChange={(event) => update('min', event.target.value)} /></label><label><span className="sr-only">{t('maxPrice')}</span><input type="number" min="0" placeholder={t('maxPrice')} value={max} onChange={(event) => update('max', event.target.value)} /></label></div>
          </fieldset>
          <label className="check-filter"><input type="checkbox" checked={stockOnly} onChange={(event) => update('stock', event.target.checked ? 'true' : '')} /><span>{t('inStock')}</span></label>
          <button className="reset-button" onClick={clearFilters}>{t('resetFilters')}</button>
        </aside>
        <div className="catalog-results">
          <div className="catalog-toolbar"><span>{filtered.length} {t('results')}</span><label>{t('sort')}<select value={sort} onChange={(event) => update('sort', event.target.value)}><option value="">{t('recommended')}</option><option value="price-low">{t('priceLow')}</option><option value="price-high">{t('priceHigh')}</option><option value="discount">{t('discountSort')}</option></select></label></div>
          {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : (
            <div className="empty-state"><span className="empty-illustration"><Icon name="search" size={28} /></span><h2>{t('noResults')}</h2><button className="button button-primary" onClick={clearFilters}>{t('resetFilters')}</button></div>
          )}
        </div>
      </div>
    </main>
  );
}
