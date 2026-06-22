import {data as remixData, Form, NavLink, Outlet, useLoaderData, useLocation} from 'react-router';
import type {Route} from './+types/account';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';

export function shouldRevalidate() {
  return true;
}

export async function loader({context}: Route.LoaderArgs) {
  const {customerAccount} = context;
  const {data, errors} = await customerAccount.query(CUSTOMER_DETAILS_QUERY, {
    variables: {language: customerAccount.i18n.language},
  });
  if (errors?.length || !data?.customer) throw new Error('Customer not found');
  return remixData(
    {customer: data.customer},
    {headers: {'Cache-Control': 'no-cache, no-store, must-revalidate'}},
  );
}

export default function AccountLayout() {
  const {customer} = useLoaderData<typeof loader>();
  const name = customer?.firstName || 'there';

  return (
    <div className="account-layout">
      <aside className="account-sidebar">
        <div className="account-sidebar-user">
          <div className="account-sidebar-avatar">{name[0]?.toUpperCase()}</div>
          <div className="account-sidebar-greeting">Welcome, {name}</div>
        </div>
        <nav className="account-sidebar-nav">
          <SidebarLink to="/account/orders" icon="orders">
            Orders
          </SidebarLink>
          <SidebarLink to="/account/profile" icon="profile">
            Profile
          </SidebarLink>
          <SidebarLink to="/account/addresses" icon="addresses">
            Addresses
          </SidebarLink>
        </nav>
        <div className="account-sidebar-footer">
          <Form method="POST" action="/account/logout">
            <button type="submit" className="account-sidebar-signout">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign out
            </button>
          </Form>
        </div>
      </aside>
      <main className="account-content">
        <Outlet context={{customer}} />
      </main>
    </div>
  );
}

function SidebarLink({to, icon, children}: {to: string; icon: string; children: React.ReactNode}) {
  return (
    <NavLink to={to} className={({isActive}) => `account-sidebar-link${isActive ? ' account-sidebar-link--active' : ''}`}>
      <span className="account-sidebar-icon">
        {icon === 'orders' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
        )}
        {icon === 'profile' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
          </svg>
        )}
        {icon === 'addresses' && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
          </svg>
        )}
      </span>
      {children}
    </NavLink>
  );
}
