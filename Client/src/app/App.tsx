import React, { lazy, Suspense } from 'react';
import { boundary, useError } from 'react-boundary';

import { InvalidUsage } from './InvalidUsage';
import { Loading } from './Loading';

const ShopifyProducts = lazy(() =>
  import('./element/ShopifyProducts').then((module) => ({ default: module.ShopifyProducts }))
);
const Error = lazy(() => import('./Error').then((module) => ({ default: module.Error })));

export const App = boundary(() => {
  const [error, info] = useError();

  if (error || info) {
    return <Error stack={`${error && error.stack}${info && info.componentStack}`} />;
  }

  const invalidUsage = global.self === global.top;

  return (
    <Suspense fallback={<Loading />}>
      {invalidUsage && <InvalidUsage />}
      {!invalidUsage && <ShopifyProducts />}
    </Suspense>
  );
});
