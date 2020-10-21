import { useQuery } from 'graphql-hooks';
import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';

import { createStyles, makeStyles } from '@material-ui/styles';

import { IProduct, IQueryRoot } from '../../shopify';
import { element } from '../../terms.en-us.json';
import { Loading } from '../Loading';
import { ObjectTile } from './ObjectTile';
import { ElementContext } from './ShopifyProducts';

interface IShopifyProductsListProps {
  setProduct: Dispatch<SetStateAction<IProduct | undefined>>;
  setListOpen: Dispatch<SetStateAction<boolean>>;
}

const useStyles = makeStyles(() =>
  createStyles({
    list: { display: 'flex', flexWrap: 'wrap' },
  })
);

export const ShopifyProductsList: FC<IShopifyProductsListProps> = ({ setProduct, setListOpen }) => {
  const styles = useStyles();

  const { updateSize } = useContext(ElementContext);

  const [filter, setFilter] = useState<string>();

  const { loading, data } = useQuery<IQueryRoot>(
    `{
  products(first: 250) {
    edges {
      node {
        id
        images(first: 1, maxHeight: 250) {
          edges {
            node {
              originalSrc
              transformedSrc 
            }
          }
        }
        title,
        descriptionHtml,
        variants(first: 1) {
          edges {
            node {
              id
              priceV2 {
                amount,
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}`
  );

  useEffect(
    () => updateSize(),
    // eslint-disable-next-line
    [loading]
  );

  return (
    <div>
      {loading && <Loading />}
      {!loading && data && (
        <>
          <input
            className='form__text-field'
            type='text'
            placeholder={element.placeholder}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          />
          <div className={styles.list}>
            {data.products.edges
              .map((edge) => edge.node)
              .filter((product) => {
                if (!filter) {
                  return true;
                }

                const lowerFilter = filter.toLowerCase();

                if (product.title.toLowerCase().includes(lowerFilter)) {
                  return true;
                }

                if (product.descriptionHtml.toLowerCase().includes(lowerFilter)) {
                  return true;
                }

                return false;
              })
              .map((product) => (
                <ObjectTile
                  key={product.id}
                  name={product.title}
                  detail={product.variants.edges[0].node.priceV2.amount}
                  imageUrl={product.images.edges[0].node.originalSrc}
                  onClick={() => {
                    setProduct(product);
                    setListOpen(false);
                  }}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
};
