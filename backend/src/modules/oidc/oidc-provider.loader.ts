import type * as OidcProviderModule from 'oidc-provider';

type NodeModule = typeof import('node:module');
type NodeVm = typeof import('node:vm');

const builtin = <T>(name: string): T =>
  (process as any).getBuiltinModule(name) as T;

/**
 * oidc-provider 9.x (and jose 6) are ESM-only, while this backend compiles to
 * CommonJS. Node >= 22.12 can `require()` an ES module synchronously, so we load
 * it through Node's own `require`.
 *
 * We take `createRequire` from `process.getBuiltinModule` (Node >= 22.3) rather
 * than `import 'node:module'`: Jest replaces both `require` and the `module`
 * builtin with its own loader, which cannot load ESM. getBuiltinModule returns
 * the real one, so under Jest the provider is loaded by Node, outside the test
 * sandbox. In the compiled app this is equivalent to a plain require.
 */
export function loadOidcProvider(): typeof OidcProviderModule {
  const { createRequire } = builtin<NodeModule>('node:module');
  return createRequire(__filename)('oidc-provider');
}

/**
 * The provider validates its configuration with `isPlainObject`
 * (prototype === Object.prototype). Under Jest our code runs in a vm context
 * with its own Object.prototype, so plain objects must be re-created in the
 * main realm. Outside Jest both realms are the same and this is a shallow
 * structural copy. Functions, class instances, Sets, etc. are passed through.
 */
export function toProviderRealm<T>(value: T): T {
  const HostObject: ObjectConstructor =
    builtin<NodeVm>('node:vm').runInThisContext('Object');
  const HostArray: ArrayConstructor =
    builtin<NodeVm>('node:vm').runInThisContext('Array');

  const adopt = (v: any): any => {
    // Only arrays/objects literally created by us; library objects (e.g. the
    // interaction policy, an Array subclass) are passed through untouched.
    if (Array.isArray(v) && Object.getPrototypeOf(v) === Array.prototype) {
      return HostArray.from(v, adopt);
    }
    if (
      v &&
      typeof v === 'object' &&
      Object.getPrototypeOf(v) === Object.prototype
    ) {
      const out = HostObject.create(HostObject.prototype);
      for (const key of Object.keys(v)) out[key] = adopt(v[key]);
      return out;
    }
    return v;
  };
  return adopt(value);
}
