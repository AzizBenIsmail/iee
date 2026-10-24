import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { products, categories, getDiscount, getProductName } from './data/products';

beforeEach(() => window.localStorage.clear());

test('renders the Shopy storefront and its product categories', () => {
  render(<App />);
  expect(screen.getByRole('link', { name: 'Shopy.tn accueil' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /explorer les catégories/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /électronique/i })).toHaveAttribute('href', '/catalogue?category=electronique');
});

test('ships a realistic demo catalogue with computed discounts', () => {
  expect(products).toHaveLength(32);
  expect(categories).toHaveLength(6);
  expect(products.filter((product) => product.isPopular)).toHaveLength(4);
  expect(products.some((product) => product.stock === 0)).toBe(true);
  expect(products.every((product) => product.names.en && product.names.ar)).toBe(true);
  expect(getProductName(products[0], 'en')).toBe('Wireless Buds Pro earbuds');
  expect(getProductName(products[0], 'ar')).toBe('سماعات لاسلكية بودز برو');
  expect(Math.max(...products.map(getDiscount))).toBe(38);
  expect(products.every((product) => product.price < product.originalPrice && getDiscount(product) > 0)).toBe(true);
});

test('switches the full interface to Arabic RTL without reloading', () => {
  render(<App />);
  fireEvent.change(screen.getAllByRole('combobox', { name: 'Choisir la langue' })[0], { target: { value: 'ar' } });
  expect(document.documentElement).toHaveAttribute('lang', 'ar');
  expect(document.documentElement).toHaveAttribute('dir', 'rtl');
  expect(screen.getByRole('heading', { name: 'تسوق حسب الفئة' })).toBeInTheDocument();
});
