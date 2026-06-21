import {Suspense} from 'react';
import {Await, NavLink} from 'react-router';
import type {FooterQuery, HeaderQuery} from 'storefrontapi.generated';

interface FooterProps {
  footer: Promise<FooterQuery | null>;
  header: HeaderQuery;
  publicStoreDomain: string;
}

export function Footer({
  footer: footerPromise,
  header,
  publicStoreDomain,
}: FooterProps) {
  return (
    <Suspense>
      <Await resolve={footerPromise}>
        {(footer) => (
          <FooterContent
            footer={footer}
            header={header}
            publicStoreDomain={publicStoreDomain}
          />
        )}
      </Await>
    </Suspense>
  );
}

function FooterContent({footer, header, publicStoreDomain}: {footer: FooterQuery | null, header: HeaderQuery, publicStoreDomain: string}) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <NavLink to="/" className="footer-logo">ecode Shop</NavLink>
          <p className="footer-tagline">
            Your premium destination for curated products.
          </p>
          <div className="footer-social">
            <span>Instagram</span>
            <span>Twitter</span>
            <span>Facebook</span>
          </div>
        </div>
        <div className="footer-links">
          <div className="footer-column">
            <h4>Shop</h4>
            <NavLink to="/collections">Collections</NavLink>
            <NavLink to="/products">All Products</NavLink>
            <NavLink to="/search">Search</NavLink>
          </div>
          <div className="footer-column">
            <h4>Account</h4>
            <NavLink to="/account">My Account</NavLink>
            <NavLink to="/account/login">Sign In</NavLink>
            <NavLink to="/cart">Cart</NavLink>
          </div>
          <div className="footer-column">
            <h4>Policies</h4>
            {(footer?.menu || FALLBACK_FOOTER_MENU).items.map((item) => {
              if (!item.url) return null;
              const url =
                item.url.includes('myshopify.com') ||
                item.url.includes(publicStoreDomain) ||
                item.url.includes(header.shop.primaryDomain?.url || '')
                  ? new URL(item.url).pathname
                  : item.url;
              const isExternal = !url.startsWith('/');
              return isExternal ? (
                <a href={url} key={item.id} rel="noopener noreferrer" target="_blank">
                  {item.title}
                </a>
              ) : (
                <NavLink end key={item.id} prefetch="intent" style={activeLinkStyle} to={url}>
                  {item.title}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p>&copy; 2026 ecode Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

const FALLBACK_FOOTER_MENU = {
  id: 'gid://shopify/Menu/199655620664',
  items: [
    {
      id: 'gid://shopify/MenuItem/461633060920',
      resourceId: 'gid://shopify/ShopPolicy/23358046264',
      tags: [],
      title: 'Privacy Policy',
      type: 'SHOP_POLICY',
      url: '/policies/privacy-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633093688',
      resourceId: 'gid://shopify/ShopPolicy/23358013496',
      tags: [],
      title: 'Refund Policy',
      type: 'SHOP_POLICY',
      url: '/policies/refund-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633126456',
      resourceId: 'gid://shopify/ShopPolicy/23358111800',
      tags: [],
      title: 'Shipping Policy',
      type: 'SHOP_POLICY',
      url: '/policies/shipping-policy',
      items: [],
    },
    {
      id: 'gid://shopify/MenuItem/461633159224',
      resourceId: 'gid://shopify/ShopPolicy/23358079032',
      tags: [],
      title: 'Terms of Service',
      type: 'SHOP_POLICY',
      url: '/policies/terms-of-service',
      items: [],
    },
  ],
};

function activeLinkStyle({
  isActive,
  isPending,
}: {
  isActive: boolean;
  isPending: boolean;
}) {
  return {
    fontWeight: isActive ? 'bold' : undefined,
    color: isPending ? 'grey' : 'white',
  };
}
