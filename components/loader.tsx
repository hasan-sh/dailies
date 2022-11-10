import styles from './loader.module.css';

const Loader = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.loader} />
        </div>
     );
}

export default Loader;