import {createHydrogenContext} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';

const additionalContext = {} as const;

type AdditionalContextType = typeof additionalContext;

declare global {
  interface HydrogenAdditionalContext extends AdditionalContextType {}
}

function toUrlString(request: RequestInfo | URL): string {
  if (typeof request === 'string') return request;
  if (request instanceof URL) return request.href;
  return request.url;
}

function createInMemoryCache(): Cache {
  const store = new Map<string, Response>();
  return {
    add: async () => {},
    addAll: async () => {},
    delete: async () => false,
    keys: async () => [],
    match: async (request) => store.get(toUrlString(request)),
    matchAll: async () => [],
    put: async (request, response) => {
      store.set(toUrlString(request), response.clone());
    },
  } satisfies Cache;
}

async function createCache(): Promise<Cache> {
  if (typeof caches !== 'undefined' && caches.open) {
    try {
      return await caches.open('hydrogen');
    } catch {
      // fall through to in-memory cache
    }
  }
  return createInMemoryCache();
}

function createWaitUntil(executionContext?: ExecutionContext) {
  if (executionContext?.waitUntil) {
    return executionContext.waitUntil.bind(executionContext);
  }
  return () => {};
}

export async function createHydrogenRouterContext(
  request: Request,
  env: Env,
  executionContext?: ExecutionContext,
) {
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = createWaitUntil(executionContext);
  const cache = await createCache();
  const session = await AppSession.init(request, [env.SESSION_SECRET]);

  const hydrogenContext = createHydrogenContext(
    {
      env,
      request,
      cache,
      waitUntil,
      session,
      i18n: {language: 'EN', country: 'US'},
      cart: {
        queryFragment: CART_QUERY_FRAGMENT,
      },
    },
    additionalContext,
  );

  return hydrogenContext;
}
