import {Link, useLoaderData, useNavigation, useSearchParams} from 'react-router';
import type {Route} from './+types/account.orders._index';
import {useRef} from 'react';
import {Money, getPaginationVariables, flattenConnection} from '@shopify/hydrogen';
import {
  buildOrderSearchQuery,
  parseOrderFilters,
  ORDER_FILTER_FIELDS,
  type OrderFilterParams,
} from '~/lib/orderFilters';
import {CUSTOMER_ORDERS_QUERY} from '~/graphql/customer-account/CustomerOrdersQuery';
import type {CustomerOrdersFragment, OrderItemFragment} from 'customer-accountapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';

type OrdersLoaderData = {
  customer: CustomerOrdersFragment;
  filters: OrderFilterParams;
};

export const meta: Route.MetaFunction = () => {
  return [{title: 'Orders'}];
};

export async function loader({request, context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const paginationVariables = getPaginationVariables(request, {pageBy: 20});
  const url = new URL(request.url);
  const filters = parseOrderFilters(url.searchParams);
  const query = buildOrderSearchQuery(filters);
  const {data, errors} = await customerAccount.query(CUSTOMER_ORDERS_QUERY, {
    variables: {...paginationVariables, query, language: customerAccount.i18n.language},
  });
  if (errors?.length || !data?.customer) throw Error('Customer orders not found');
  return {customer: data.customer, filters};
}

export default function Orders() {
  const {customer, filters} = useLoaderData<OrdersLoaderData>();
  const {orders} = customer;

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h2 className="orders-heading">Order History</h2>
        <p className="orders-subtitle">View and track all your orders</p>
      </div>
      <OrderSearchForm currentFilters={filters} />
      <OrdersTable orders={orders} filters={filters} />
    </div>
  );
}

function OrdersTable({orders, filters}: {orders: CustomerOrdersFragment['orders']; filters: OrderFilterParams}) {
  const hasFilters = !!(filters.name || filters.confirmationNumber);

  return (
    <div className="orders-list-wrap" aria-live="polite">
      {orders?.nodes.length ? (
        <PaginatedResourceSection
          connection={orders}
          resourcesClassName="orders-list"
        >
          {({node: order}) => <OrderCard key={order.id} order={order} />}
        </PaginatedResourceSection>
      ) : (
        <EmptyOrders hasFilters={hasFilters} />
      )}
    </div>
  );
}

function EmptyOrders({hasFilters = false}: {hasFilters?: boolean}) {
  return (
    <div className="orders-empty">
      <div className="orders-empty-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </div>
      {hasFilters ? (
        <>
          <p className="orders-empty-text">No orders found matching your search.</p>
          <Link to="/account/orders" className="orders-empty-btn">Clear filters</Link>
        </>
      ) : (
        <>
          <p className="orders-empty-text">You haven&apos;t placed any orders yet.</p>
          <Link to="/collections" className="orders-empty-btn">Start Shopping</Link>
        </>
      )}
    </div>
  );
}

function OrderSearchForm({currentFilters}: {currentFilters: OrderFilterParams}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigation = useNavigation();
  const isSearching = navigation.state !== 'idle' && navigation.location?.pathname?.includes('orders');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const name = formData.get(ORDER_FILTER_FIELDS.NAME)?.toString().trim();
    const confirmationNumber = formData.get(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER)?.toString().trim();
    if (name) params.set(ORDER_FILTER_FIELDS.NAME, name);
    if (confirmationNumber) params.set(ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER, confirmationNumber);
    setSearchParams(params);
  };

  const hasFilters = currentFilters.name || currentFilters.confirmationNumber;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="orders-search" aria-label="Search orders">
      <div className="orders-search-inner">
        <div className="orders-search-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
          </svg>
        </div>
        <input
          type="search"
          name={ORDER_FILTER_FIELDS.NAME}
          placeholder="Search by order number"
          aria-label="Order number"
          defaultValue={currentFilters.name || ''}
          className="orders-search-input"
        />
        <input
          type="search"
          name={ORDER_FILTER_FIELDS.CONFIRMATION_NUMBER}
          placeholder="Search by confirmation"
          aria-label="Confirmation number"
          defaultValue={currentFilters.confirmationNumber || ''}
          className="orders-search-input"
        />
        <div className="orders-search-actions">
          <button type="submit" disabled={isSearching} className="orders-search-btn">
            {isSearching ? 'Searching...' : 'Search'}
          </button>
          {hasFilters && (
            <button
              type="button"
              disabled={isSearching}
              onClick={() => { setSearchParams(new URLSearchParams()); formRef.current?.reset(); }}
              className="orders-search-clear"
            >
              Clear
            </button>
          )}
        </div>
      </div>
    </form>
  );
}

function OrderCard({order}: {order: OrderItemFragment}) {
  const fulfillmentStatus = flattenConnection(order.fulfillments)[0]?.status;

  const statusLabel = order.financialStatus === 'PAID' ? 'Paid' : order.financialStatus;
  const statusClass = order.financialStatus === 'PAID' ? 'order-status--paid'
    : order.financialStatus === 'REFUNDED' ? 'order-status--refunded'
    : 'order-status--pending';

  const fulfillLabel = fulfillmentStatus === 'FULFILLED' ? 'Shipped'
    : fulfillmentStatus === 'PARTIALLY_FULFILLED' ? 'Partial'
    : fulfillmentStatus || 'Pending';

  return (
    <div className="order-card">
      <div className="order-card-top">
        <div className="order-card-left">
          <Link to={`/account/orders/${btoa(order.id)}`} className="order-card-number">
            #{order.number}
          </Link>
          {order.confirmationNumber && (
            <span className="order-card-confirmation">{order.confirmationNumber}</span>
          )}
        </div>
        <div className="order-card-badges">
          <span className={`order-status ${statusClass}`}>{statusLabel}</span>
          <span className="order-fulfill">{fulfillLabel}</span>
        </div>
      </div>
      <div className="order-card-body">
        <div className="order-card-info">
          <span className="order-card-label">Date</span>
          <span className="order-card-value">{new Date(order.processedAt).toDateString()}</span>
        </div>
        <div className="order-card-info">
          <span className="order-card-label">Total</span>
          <span className="order-card-value">
            <Money data={order.totalPrice} />
          </span>
        </div>
      </div>
      <div className="order-card-footer">
        <Link to={`/account/orders/${btoa(order.id)}`} className="order-card-view">
          View Details
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
