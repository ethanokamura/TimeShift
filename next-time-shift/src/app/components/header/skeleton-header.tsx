import styles from "./header.module.css"

export default function SkeletonHeader() {
  return (
    <header className={styles.skeleton}>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonSubTitle}></div>
      <div className={styles.skeletonDescription}></div>
    </header>
  );
}

