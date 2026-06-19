import {Await, useLoaderData, Link} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';
import {Image} from '@shopify/hydrogen';
import type {
  FeaturedCollectionFragment,
  RecommendedProductsQuery,
} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';

export const meta: Route.MetaFunction = () => {
  return [{title: 'ecode Shop — Premium Curated Products'}];
};

export async function loader(args: Route.LoaderArgs) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return {...deferredData, ...criticalData};
}

async function loadCriticalData({context}: Route.LoaderArgs) {
  const [featuredData, arrivalsData] = await Promise.all([
    context.storefront.query(FEATURED_COLLECTION_QUERY).catch(() => null),
    context.storefront.query(NEW_ARRIVALS_QUERY).catch(() => null),
  ]);

  const collections = featuredData?.collections?.nodes || [];
  const arrivals = arrivalsData?.products?.nodes || [];

  return {
    featuredCollection: collections[0],
    featuredCollections: collections,
    newArrivals: arrivals.slice(0, 4),
  };
}

function loadDeferredData({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="home">
      <FeaturedCollection collection={data.featuredCollection} />
      <CollectionsGrid collections={data.featuredCollections} />
      <PromoBanner />
      <WhyChooseUs />
      <Testimonials />
      <NewArrivals products={data.newArrivals} />
      <RecommendedProducts products={data.recommendedProducts} />
      <BrandStory />
      <NewsletterSection />
    </div>
  );
}

function FeaturedCollection({
  collection,
}: {
  collection: FeaturedCollectionFragment;
}) {
  if (!collection) return null;
  const image = collection?.image;
  return (
    <Link
      className="featured-collection"
      to={`/collections/${collection.handle}`}
    >
      {image && (
        <div className="featured-collection-image">
          <div className="featured-collection-overlay" />
          <Image data={image} sizes="100vw" />
        </div>
      )}
      <div className="featured-collection-content">
        <p className="featured-collection-badge">New Collection</p>
        <h1 className="featured-collection-hero-title">Discover Your Style</h1>
        <p className="featured-collection-subtitle">
          Curated pieces that define your unique look
        </p>
        <span className="featured-collection-cta">Shop {collection.title} →</span>
      </div>
    </Link>
  );
}

function CollectionsGrid({
  collections,
}: {
  collections: FeaturedCollectionFragment[];
}) {
  return (
    <section className="collections-grid-section">
      <div className="section-header">
        <h2>Shop by Category</h2>
        <Link to="/collections" className="section-link">View All →</Link>
      </div>
      <div className="collections-grid-home">
        {collections.map((col) => (
          <Link
            key={col.id}
            to={`/collections/${col.handle}`}
            className="collection-card-home"
          >
            {col.image && (
              <div className="collection-card-home-image">
                <div className="collection-card-home-overlay" />
                <Image data={col.image} sizes="(min-width: 45em) 25vw, 50vw" />
              </div>
            )}
            <div className="collection-card-home-content">
              <h3>{col.title}</h3>
              <span className="collection-card-home-link">Explore →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'Worldwide Shipping',
      desc: 'Free delivery to over 50 countries with tracked shipping.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      ),
      title: 'Secure Payment',
      desc: '100% secure checkout with encrypted transactions.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      ),
      title: 'Easy Returns',
      desc: '30-day hassle-free return policy, no questions asked.',
    },
    {
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
      ),
      title: '24/7 Support',
      desc: 'Dedicated support team ready to help anytime.',
    },
  ];

  return (
    <section className="why-choose-us">
      <div className="section-header">
        <h2>Why Choose Us</h2>
      </div>
      <div className="features-grid">
        {features.map((f, i) => (
          <div key={i} className="feature-card">
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function NewArrivals({
  products,
}: {
  products: any[];
}) {
  return (
    <section className="new-arrivals">
      <div className="section-header">
        <h2>New Arrivals</h2>
        <Link to="/products" className="section-link">View All →</Link>
      </div>
      <div className="new-arrivals-grid">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section className="recommended-products">
      <div className="section-header">
        <h2>Recommended Products</h2>
      </div>
      <Suspense fallback={<div className="loading-grid">Loading...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

function PromoBanner() {
  return (
    <section className="promo-banner">
      <div className="promo-banner-content">
        <span className="promo-badge">Limited Time</span>
        <h2>Free Shipping on Orders Over $50</h2>
        <p>Use code <strong>FREESHIP</strong> at checkout — offer ends soon.</p>
        <Link to="/collections" className="promo-btn">Shop Now →</Link>
      </div>
    </section>
  );
}

function Testimonials() {
  const reviews = [
    {
      name: 'Sarah M.',
      avatar: 'S',
      location: 'New York, USA',
      rating: 5,
      text: 'Absolutely love my purchase! The quality exceeded my expectations and shipping was incredibly fast.',
    },
    {
      name: 'James K.',
      avatar: 'J',
      location: 'London, UK',
      rating: 5,
      text: 'Best shopping experience. The customer service team helped me find the perfect size. Will definitely order again.',
    },
    {
      name: 'Elena R.',
      avatar: 'E',
      location: 'Berlin, Germany',
      rating: 4,
      text: 'Great products at fair prices. The fabric feels premium and the fit is perfect. Highly recommend!',
    },
    {
      name: 'Marcus L.',
      avatar: 'M',
      location: 'Toronto, Canada',
      rating: 5,
      text: 'Been a loyal customer for months. Every piece I\'ve bought has been stylish and durable. My go-to shop.',
    },
  ];

  const doubled = [...reviews, ...reviews, ...reviews];
  const row1 = doubled;
  const row2 = [...reviews].reverse();
  const doubled2 = [...row2, ...row2, ...row2];

  const renderCard = (r: typeof reviews[0], i: number) => (
    <div key={i} className="testimonial-card">
      <div className="testimonial-stars">
        {Array.from({length: 5}).map((_, j) => (
          <svg key={j} width="14" height="14" viewBox="0 0 24 24" fill={j < r.rating ? '#f59e0b' : 'none'} stroke="#f59e0b" strokeWidth="2">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        ))}
      </div>
      <p className="testimonial-text">&ldquo;{r.text}&rdquo;</p>
      <div className="testimonial-author">
        <span className="testimonial-avatar">{r.avatar}</span>
        <div>
          <strong>{r.name}</strong>
          <span>{r.location}</span>
        </div>
      </div>
    </div>
  );

  return (
    <section className="testimonials">
      <div className="section-header">
        <h2>What Our Customers Say</h2>
      </div>
      <div className="testimonials-scroll">
        <div className="testimonials-track testimonials-track-right">
          {doubled.map((r, i) => renderCard(r, i))}
        </div>
        <div className="testimonials-track testimonials-track-left">
          {doubled2.map((r, i) => renderCard(r, i + 1000))}
        </div>
      </div>
    </section>
  );
}

function BrandStory() {
  return (
    <section className="brand-story">
      <div className="brand-story-grid">
        <div className="brand-story-image">
          <div className="brand-story-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
        </div>
        <div className="brand-story-content">
          <span className="brand-story-label">Our Story</span>
          <h2>Designed with Purpose, Made with Passion</h2>
          <p>
            At ecode Shop, we believe fashion should feel good — on you and for the planet.
            Every piece in our collection is thoughtfully curated and crafted with premium
            materials that stand the test of time.
          </p>
          <div className="brand-stats">
            <div className="brand-stat">
              <strong>10K+</strong>
              <span>Happy Customers</span>
            </div>
            <div className="brand-stat">
              <strong>500+</strong>
              <span>Products</span>
            </div>
            <div className="brand-stat">
              <strong>50+</strong>
              <span>Countries</span>
            </div>
          </div>
          <Link to="/collections" className="brand-story-btn">Explore Collections →</Link>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection() {
  return (
    <section className="newsletter-section">
      <div className="newsletter-inner">
        <h2>Stay in the Loop</h2>
        <p>Subscribe to get exclusive offers, new arrivals, and behind-the-scenes content.</p>
        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Enter your email"
            className="newsletter-input"
            required
          />
          <button type="submit" className="newsletter-btn">Subscribe</button>
        </form>
      </div>
    </section>
  );
}

const FEATURED_COLLECTION_QUERY = `#graphql
  fragment FeaturedCollection on Collection {
    id
    title
    image {
      id
      url
      altText
      width
      height
    }
    handle
  }
  query FeaturedCollection($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    collections(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...FeaturedCollection
      }
    }
  }
` as const;

const NEW_ARRIVALS_QUERY = `#graphql
  fragment NewArrivalProduct on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query NewArrivals($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...NewArrivalProduct
      }
    }
  }
` as const;

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle
    description
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    featuredImage {
      id
      url
      altText
      width
      height
    }
  }
  query RecommendedProducts ($country: CountryCode, $language: LanguageCode)
    @inContext(country: $country, language: $language) {
    products(first: 4, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;
