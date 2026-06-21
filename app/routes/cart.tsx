import {useLoaderData, data, type HeadersFunction, Link} from 'react-router';
import type {Route} from './+types/cart';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm, Image, Money, useOptimisticCart, type OptimisticCartLine} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/lib/variants';
import {ProductPrice} from '~/components/ProductPrice';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Your Cart — ecode Shop'}];
};

export const headers: HeadersFunction = ({actionHeaders}) => actionHeaders;

export async function action({request, context}: Route.ActionArgs) {
  const {cart} = context;
  const formData = await request.formData();
  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) throw new Error('No action provided');

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;
      const discountCodes = (formDiscountCode ? [formDiscountCode] : []) as string[];
      discountCodes.push(...inputs.discountCodes);
      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesAdd: {
      const formGiftCardCode = inputs.giftCardCode;
      const giftCardCodes = (formGiftCardCode ? [formGiftCardCode] : []) as string[];
      result = await cart.addGiftCardCodes(giftCardCodes);
      break;
    }
    case CartForm.ACTIONS.GiftCardCodesRemove: {
      const appliedGiftCardIds = inputs.giftCardCodes as string[];
      result = await cart.removeGiftCardCodes(appliedGiftCardIds);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({...inputs.buyerIdentity});
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result?.cart?.id;
  const headers = cartId ? cart.setCartId(result.cart.id) : new Headers();
  const {cart: cartResult, errors, warnings} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  return data(
    {cart: cartResult, errors, warnings, analytics: {cartId}},
    {status, headers},
  );
}

export async function loader({context}: Route.LoaderArgs) {
  const {cart} = context;
  return await cart.get();
}

/* ─── Cart Page Component ──────────────────────────────────────────── */

export default function CartPage() {
  const originalCart = useLoaderData<typeof loader>();
  const cart = useOptimisticCart(originalCart);
  const cartHasItems = cart?.totalQuantity ? cart.totalQuantity > 0 : false;

  return (
    <div className="cart-page">
      <section className="cart-page-header">
        <h1 className="cart-page-title">Shopping Cart</h1>
        {cartHasItems && (
          <span className="cart-page-count">
            {cart.totalQuantity} {cart.totalQuantity === 1 ? 'item' : 'items'}
          </span>
        )}
      </section>

      {!cartHasItems ? (
        <CartEmpty />
      ) : (
        <div className="cart-page-grid">
          <ul className="cart-page-lines">
            {(cart?.lines?.nodes ?? []).map((line) => (
              <CartItem key={line.id} line={line} />
            ))}
          </ul>

          <aside className="cart-page-sidebar">
            <div className="cart-page-summary">
              <h3 className="cart-page-summary-title">Order Summary</h3>

              <div className="cart-page-summary-row">
                <span>Subtotal</span>
                <span className="cart-page-summary-value">
                  {cart?.cost?.subtotalAmount?.amount ? (
                    <Money data={cart?.cost?.subtotalAmount} />
                  ) : '-'}
                </span>
              </div>

              {cart?.cost?.totalTaxAmount?.amount && Number(cart.cost.totalTaxAmount.amount) > 0 && (
                <div className="cart-page-summary-row tax">
                  <span>Tax</span>
                  <span className="cart-page-summary-value">
                    <Money data={cart.cost.totalTaxAmount} />
                  </span>
                </div>
              )}

              <div className="cart-page-summary-divider" />

              <div className="cart-page-summary-row total">
                <span>Total</span>
                <span className="cart-page-summary-value">
                  {cart?.cost?.totalAmount?.amount ? (
                    <Money data={cart?.cost?.totalAmount} />
                  ) : '-'}
                </span>
              </div>

              <p className="cart-page-summary-note">
                Shipping & taxes calculated at checkout
              </p>

              {cart?.checkoutUrl && (
                <a
                  href={cart.checkoutUrl}
                  target="_self"
                  className="cart-page-checkout-btn"
                >
                  Proceed to Checkout
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </a>
              )}

              <Link to="/collections" className="cart-page-continue">
                ← Continue Shopping
              </Link>
            </div>

            {cart?.discountCodes?.length ? (
              <div className="cart-page-discounts">
                <h4>Applied Discounts</h4>
                {cart.discountCodes.map((code) => (
                  <span key={code.code} className="cart-page-discount-tag">
                    {code.code}
                    <CartForm
                      route="/cart"
                      action={CartForm.ACTIONS.DiscountCodesUpdate}
                      inputs={{discountCode: '', discountCodes: cart.discountCodes?.filter((c) => c.code !== code.code).map((c) => c.code) ?? []}}
                    >
                      <button type="submit" aria-label="Remove discount">×</button>
                    </CartForm>
                  </span>
                ))}
              </div>
            ) : (
              <CartForm
                route="/cart"
                action={CartForm.ACTIONS.DiscountCodesUpdate}
                inputs={{discountCodes: cart?.discountCodes?.map((c) => c.code) ?? []}}
              >
                <div className="cart-page-promo">
                  <input
                    type="text"
                    name="discountCode"
                    placeholder="Promo code"
                    className="cart-page-promo-input"
                  />
                  <button type="submit" className="cart-page-promo-btn">
                    Apply
                  </button>
                </div>
              </CartForm>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

/* ─── Cart Item ────────────────────────────────────────────────────── */

function CartItem({line}: {line: OptimisticCartLine<CartApiQueryFragment>}) {
  if ('parentRelationship' in line && line.parentRelationship?.parent) return null;

  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);

  return (
    <li className="cart-page-item">
      <div className="cart-page-item-inner">
        {image ? (
          <Link to={lineItemUrl} className="cart-page-item-image">
            <Image
              alt={title}
              aspectRatio="1/1"
              data={image}
              height={120}
              loading="lazy"
              width={120}
            />
          </Link>
        ) : (
          <div className="cart-page-item-image cart-page-item-image--empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        <div className="cart-page-item-details">
          <Link to={lineItemUrl} className="cart-page-item-title">
            {product.title}
          </Link>
          {selectedOptions.map((opt) => (
            <span key={opt.name} className="cart-page-item-variant">
              {opt.name}: {opt.value}
            </span>
          ))}
          <div className="cart-page-item-price-mobile">
            <ProductPrice price={line?.cost?.totalAmount} />
          </div>
          <CartItemQuantity line={line} />
        </div>

        <div className="cart-page-item-price">
          <ProductPrice price={line?.cost?.totalAmount} />
        </div>
      </div>
    </li>
  );
}

/* ─── Quantity Controls ────────────────────────────────────────────── */

function CartItemQuantity({line}: {line: OptimisticCartLine<CartApiQueryFragment>}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-page-qty">
      <CartLineUpdateButton lines={[{id: lineId, quantity: prevQuantity}]}>
        <button aria-label="Decrease quantity" disabled={quantity <= 1 || !!isOptimistic}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </CartLineUpdateButton>
      <span className="cart-page-qty-num">{quantity}</span>
      <CartLineUpdateButton lines={[{id: lineId, quantity: nextQuantity}]}>
        <button aria-label="Increase quantity" disabled={!!isOptimistic}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </CartLineUpdateButton>
      <CartLineRemoveButton lineIds={[lineId]} disabled={!!isOptimistic} />
    </div>
  );
}

function CartLineRemoveButton({lineIds, disabled}: {lineIds: string[]; disabled: boolean}) {
  return (
    <CartForm
      fetcherKey={['remove', ...lineIds].join('-')}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      <button className="cart-page-remove" disabled={disabled} type="submit" aria-label="Remove item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6" />
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </CartForm>
  );
}

function CartLineUpdateButton({
  children,
  lines,
}: {
  children: React.ReactNode;
  lines: CartLineUpdateInput[];
}) {
  const lineIds = lines.map((line) => line.id);
  return (
    <CartForm
      fetcherKey={[CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-')}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

/* ─── Empty Cart ───────────────────────────────────────────────────── */

function CartEmpty() {
  return (
    <div className="cart-page-empty">
      <div className="cart-page-empty-icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      </div>
      <h2>Your cart is empty</h2>
      <p>Looks like you haven't added anything yet. Discover products you'll love.</p>
      <Link to="/collections" className="cart-page-empty-btn">
        Browse Collections
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </Link>
    </div>
  );
}
