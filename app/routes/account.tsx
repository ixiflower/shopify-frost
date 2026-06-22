import {data as remixData, Form, NavLink, Outlet, useLoaderData} from 'react-router';
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
    <div className="account-page">
      <div className="account-header">
        <h2 className="account-heading">Welcome, {name}</h2>
        <Form method="POST" action="/account/logout">
          <button type="submit" className="account-signout">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign out
          </button>
        </Form>
      </div>
      <nav className="account-tabs">
        <AccountTab to="/account/orders" label="Orders" />
        <AccountTab to="/account/profile" label="Profile" />
        <AccountTab to="/account/addresses" label="Addresses" />
      </nav>
      <main className="account-main">
        <Outlet context={{customer}} />
      </main>
    </div>
  );
}

function AccountTab({to, label}: {to: string; label: string}) {
  return (
    <NavLink to={to} end className={({isActive}) => `account-tab${isActive ? ' account-tab--active' : ''}`}>
      {label}
    </NavLink>
  );
}
