import clsx from 'clsx';
import React, { FC } from 'react';

import { createStyles, makeStyles } from '@material-ui/styles';

import { shared } from '../../terms.en-us.json';

interface IObjectTileProps {
  name: string;
  detail: string;
  imageUrl: string;
  onClick?: () => void;
  download?: boolean;
  onRemove?: () => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: { width: 'calc(100% / 3 - 1em)', margin: '0.5em' },
    content: {
      position: 'relative',
      width: '100%',
      cursor: 'pointer',
      backgroundColor: '#f5f5f5',
      border: '2px solid #d0cfce',
      borderRadius: 2,
      transition: 'all 0.15s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      '&.selected': {
        outline: '0.2em solid #0a68f5',
        boxShadow: '0 1px 8px 2px rgba(0, 0, 0, 0.2)',
      },
    },
    actionsPane: {
      position: 'absolute',
      top: 0,
      zIndex: 100,
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      cursor: 'default',
      backgroundColor: 'hsla(0, 0%, 96.1%, 0.85)',
    },
    icon: {
      padding: '0.5em 0.6em',
      fontSize: '1em',
      color: '#424242',
      cursor: 'pointer',
    },
    download: {
      '&:hover': { color: '#fff', backgroundColor: '#0749ab' },
    },
    remove: {
      '&:hover': { color: '#fff', backgroundColor: '#f02222' },
    },
    preview: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      height: 200,
    },
    image: {
      maxWidth: '100%',
      maxHeight: '100%',
    },
    bottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      display: 'flex',
      width: '100%',
      backgroundColor: 'hsla(0, 0%, 96.1%, 0.8)',
      borderBottomRightRadius: '0.1em',
      borderBottomLeftRadius: '0.1em',
      transition: 'all 0.15s cubic-bezier(0.23, 1, 0.32, 1) 0ms',
      padding: '0.5em',
    },
    summary: {
      minWidth: 0,
    },
    title: {
      display: 'block',
      width: '100%',
      marginBottom: '0.25em',
      fontSize: '0.9em',
      lineHeight: 1.25,
      wordWrap: 'break-word',
      whiteSpace: 'nowrap',
    },
    name: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',

      '&:hover': {
        overflow: 'visible',
        whiteSpace: 'normal',
      },
    },
    fileName: { color: '#424242' },
    techDetails: {
      display: 'block',
      fontSize: '0.8em',
      lineHeight: 1.1,
      opacity: 1,
    },
    techDetail: {
      '&:after': {
        color: '#424242',
        content: 'A0B7A0',
      },

      '&:last-of-type:after': {
        content: '',
      },
    },
  })
);

export const ObjectTile: FC<IObjectTileProps> = ({ name, detail, imageUrl, onClick, download, onRemove }) => {
  const styles = useStyles();

  return (
    <div className={styles.wrapper}>
      <div className={styles.content} onClick={onClick}>
        <div className={styles.actionsPane}>
          {download && (
            <a
              target='_blank'
              rel='noopener noreferrer'
              href={imageUrl}
              data-balloon={shared.download}
              data-balloon-pos='down'
            >
              <i aria-hidden='true' className={clsx(styles.icon, styles.download, 'icon-download')} />
            </a>
          )}
          {onRemove && (
            <div onClick={() => onRemove()} data-balloon='Remove' data-balloon-pos='down'>
              <i aria-hidden='true' className={clsx(styles.icon, styles.remove, 'icon-remove')} />
            </div>
          )}
        </div>
        <div className={styles.preview}>
          <img className={styles.image} alt={name} src={imageUrl} />
        </div>
        <div className={styles.bottom}>
          <div className={styles.summary}>
            <div className={styles.title}>
              <div className={styles.name}>
                <span className={styles.fileName}>{name}</span>
              </div>
            </div>
            <span className={styles.techDetails}>
              <span className={styles.techDetail}>{detail}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
