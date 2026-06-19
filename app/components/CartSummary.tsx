import type {CartLayout} from '~/components/CartMain';
import {Money, type OptimisticCart} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartSummaryProps = {
  cart: OptimisticCart<CartApiQueryFragment | null>;
  layout: CartLayout;
};

export function CartSummary({cart, layout}: CartSummaryProps) {
  const className = layout === 'page' ? 'cart-summary-page' : 'cart-summary-aside';

  return (
    <div className={className}>
      <div className="cart-summary-row">
        <span>Subtotal</span>
        <span className="cart-summary-price">
          {cart?.cost?.subtotalAmount?.amount ? (
            <Money data={cart?.cost?.subtotalAmount} />
          ) : '-'}
        </span>
      </div>
      <p className="cart-summary-note">Shipping & taxes calculated at checkout</p>
      {cart?.checkoutUrl && (
        <a href={cart.checkoutUrl} target="_self" className="cart-checkout-btn">
          Checkout
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      )}
    </div>
  );
}
