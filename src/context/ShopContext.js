import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';
import { products } from '../data/products';

const ShopContext = createContext(null);

function normalizeCart(value) {
  if (!Array.isArray(value)) return [];
  return value.reduce((items, item) => {
    const product = item && products.find((candidate) => candidate.id === item.id);
    if (!product || !Number.isFinite(item.quantity) || item.quantity <= 0) return items;
    const quantity = Math.min(Math.floor(item.quantity), product.stock);
    if (quantity > 0) {
      const existing = items.find((entry) => entry.id === item.id);
      if (existing) existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      else items.push({ id: item.id, quantity });
    }
    return items;
  }, []);
}

function normalizeFavorites(value) {
  return Array.isArray(value) ? [...new Set(value.filter((id) => products.some((product) => product.id === id)))] : [];
}

function readStored(key, fallback, normalize = (value) => value) {
  try {
    const value = window.localStorage.getItem(key);
    return value === null ? fallback : normalize(JSON.parse(value));
  } catch (error) {
    console.error(`Could not read "${key}" from local storage.`, error);
    return fallback;
  }
}

function useStoredState(key, fallback, normalize) {
  const [value, setValue] = useState(() => readStored(key, fallback, normalize));
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Could not save "${key}" to local storage.`, error);
    }
  }, [key, value]);
  return [value, setValue];
}

export function ShopProvider({ children }) {
  const systemTheme = window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const [cart, setCart] = useStoredState('shopy-cart', [], normalizeCart);
  const [favorites, setFavorites] = useStoredState('shopy-favorites', [], normalizeFavorites);
  const [language, setLanguage] = useStoredState('shopy-language', 'fr', (value) => ['fr', 'en', 'ar'].includes(value) ? value : 'fr');
  const [savedTheme, setSavedTheme] = useStoredState('shopy-theme', null, (value) => ['light', 'dark'].includes(value) ? value : null);
  const [toast, setToast] = useState('');
  const theme = savedTheme || systemTheme;
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    document.documentElement.dataset.theme = theme;
  }, [language, direction, theme]);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const t = useCallback((key) => translations[language]?.[key] ?? translations.fr[key] ?? key, [language]);
  const addToCart = useCallback((id, quantity = 1) => {
    const product = products.find((item) => item.id === id);
    if (!product || product.stock < 1) {
      setToast(t('stockUnavailable'));
      return;
    }
    setCart((items) => {
      const existing = items.find((item) => item.id === id);
      return existing
        ? items.map((item) => item.id === id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item)
        : [...items, { id, quantity: Math.min(Math.max(1, quantity), product.stock) }];
    });
    setToast(t('added'));
  }, [setCart, t]);
  const updateQuantity = useCallback((id, quantity) => {
    if (quantity < 1) {
      setCart((items) => items.filter((item) => item.id !== id));
      return;
    }
    const product = products.find((item) => item.id === id);
    if (!product) {
      setCart((items) => items.filter((item) => item.id !== id));
      return;
    }
    setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.min(Math.floor(quantity), product.stock) } : item));
  }, [setCart]);
  const removeFromCart = useCallback((id) => setCart((items) => items.filter((item) => item.id !== id)), [setCart]);
  const toggleFavorite = useCallback((id) => setFavorites((items) => (
    items.includes(id) ? items.filter((item) => item !== id) : [...items, id]
  )), [setFavorites]);
  const toggleTheme = useCallback(() => setSavedTheme(theme === 'dark' ? 'light' : 'dark'), [setSavedTheme, theme]);
  const value = {
    cart, favorites, language, setLanguage, theme, toggleTheme, direction, t, toast,
    addToCart, updateQuantity, removeFromCart, toggleFavorite,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error('useShop must be used inside ShopProvider');
  return context;
}
