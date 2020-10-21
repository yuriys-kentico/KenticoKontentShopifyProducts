import clsx from 'clsx';
import { ClientContext, GraphQLClient } from 'graphql-hooks';
import parse from 'html-react-parser';
import React, {
    createContext,
    FC,
    Fragment,
    useCallback,
    useEffect,
    useRef,
    useState
} from 'react';

import { createStyles, makeStyles } from '@material-ui/styles';

import { kenticoKontent } from '../../appSettings.json';
import { IContext, ICustomElement } from '../../customElement';
import { IPriceV2, IProduct } from '../../shopify';
import { element as elementTerms } from '../../terms.en-us.json';
import { loadModule } from '../../utilities/modules';
import { IShopifyProductsConfig } from '../shared/IShopifyProductsConfig';
import { ShopifyProductsList } from './ShopifyProductsList';

// Expose access to APIs
declare const CustomElement: ICustomElement<IShopifyProductsConfig>;

const useStyles = makeStyles(() =>
  createStyles({
    row: { display: 'flex', flexDirection: 'row', margin: '4px 0' },
    fullWidthCell: { flex: 1 },
    submit: { width: 'auto', margin: '0 auto' },
    imageCell: { flex: 1 },
    image: { maxWidth: '100%' },
    descriptionCell: { flex: 2 },
  })
);

interface IElementContext {
  updateSize: () => void;
}

const defaultElementContext: IElementContext = {
  updateSize: () => {},
};

export const ElementContext = createContext<IElementContext>(defaultElementContext);

export const ShopifyProducts: FC = () => {
  const styles = useStyles();

  const [available, setAvailable] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [customElementConfig, setCustomElementConfig] = useState<IShopifyProductsConfig>();
  const [updateSize, setUpdateSize] = useState(false);
  // const [loading, setLoading] = useState(false);

  const [listOpen, setListOpen] = useState(false);
  const [product, setProduct] = useState<IProduct>();

  const elementRef = useRef<HTMLDivElement>(null);
  const graphqlClient = useRef<GraphQLClient>();

  useEffect(() => {
    if (!available) {
      const initCustomElement = (element: ICustomElement<IShopifyProductsConfig>, context: IContext) => {
        const elementValue = element.value !== null && (JSON.parse(element.value) as IProduct);

        if (elementValue) {
          setProduct(elementValue);
        }

        if (element.config) {
          setCustomElementConfig(element.config);
        }

        setElementEnabled(!element.disabled);
        CustomElement.onDisabledChanged((disabled) => setElementEnabled(!disabled));
        setAvailable(true);
      };

      const setElementEnabled = (enabled: boolean) => {
        setEnabled(enabled);
      };

      loadModule(kenticoKontent.customElementScriptEndpoint, () => CustomElement.init(initCustomElement));
    }
  }, [available]);

  useEffect(() => {
    if (available && elementRef.current) {
      let totalHeight = elementRef.current.scrollHeight;

      CustomElement.setHeight(totalHeight);
    }
  });

  useEffect(() => {
    if (available && customElementConfig && !graphqlClient.current) {
      graphqlClient.current = new GraphQLClient({
        url: customElementConfig.graphqlEndpoint,
        headers: {
          'X-Shopify-Storefront-Access-Token': customElementConfig.storefrontAccessToken,
          accept: 'application/json',
        },
      });
    }
  });

  useEffect(() => {
    if (available && enabled) {
      CustomElement.setValue(JSON.stringify(product ?? null));
    }
  }, [available, enabled, product]);

  const formatProductPrice = useCallback((price: IPriceV2) => {
    const { amount, currencyCode } = price;

    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currencyCode,
    }).format(parseFloat(amount));
  }, []);

  const elementContext: IElementContext = {
    updateSize: () => setUpdateSize(!updateSize),
  };

  return (
    <ElementContext.Provider value={elementContext}>
      {available && (
        <div ref={elementRef}>
          {enabled && customElementConfig && (
            <>
              <div className={styles.row}>
                <div className={styles.fullWidthCell}>
                  <p>{elementTerms.enabledDescription}</p>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.fullWidthCell}>
                  <button
                    className={clsx(styles.submit, 'btn btn--primary btn--xs')}
                    onClick={() => {
                      setListOpen(true);
                    }}
                  >
                    {elementTerms.open}
                  </button>
                  {product && (
                    <button
                      className={clsx(styles.submit, 'btn btn--destructive btn--xs')}
                      onClick={() => {
                        setProduct(undefined);
                      }}
                    >
                      {elementTerms.clear}
                    </button>
                  )}
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.fullWidthCell}>
                  {graphqlClient.current && (
                    <ClientContext.Provider value={graphqlClient.current}>
                      {listOpen && <ShopifyProductsList setProduct={setProduct} setListOpen={setListOpen} />}
                    </ClientContext.Provider>
                  )}
                </div>
              </div>
              {product && (
                <div className={styles.row}>
                  <div className={styles.fullWidthCell}>
                    <p>{elementTerms.previewExplanation}</p>
                  </div>
                </div>
              )}
              {product && (
                <div className={styles.row}>
                  <div className={styles.fullWidthCell}>
                    <div className={styles.row}>
                      <div className={styles.imageCell}>
                        <img
                          className={styles.image}
                          src={product.images.edges[0].node.originalSrc}
                          alt={product.title}
                          onLoad={() => setUpdateSize(!updateSize)}
                        />
                      </div>
                      <div className={styles.descriptionCell}>
                        <h2>{product.title}</h2>
                        <h3>{formatProductPrice(product.variants.edges[0].node.priceV2)}</h3>
                        {parse(product.descriptionHtml, {
                          replace: (domNode) => {
                            switch (domNode.name) {
                              case 'object':
                                return <Fragment />;

                              default:
                                return domNode;
                            }
                          },
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </ElementContext.Provider>
  );
};
