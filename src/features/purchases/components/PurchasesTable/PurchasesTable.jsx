import styles from './style.scss';

/**
 *
 * @param {React.ReactNode} children
 * @returns {JSX.Element}
 */

function PurchasesWrapper({ children }) {
  return <div className={styles.table}>{children}</div>;
}

export function PurchasesTable({ data }) {
    if(!data.length)
    return <PurchasesWrapper>
        
    </PurchasesWrapper>
}
