import { STATUS_LABELS } from "../../app/labels";
import styles from "./StatusBadge.module.css";

export function StatusBadge({ status }: { status: string }) {
  return <span className={`${styles.badge} ${styles[status]}`}>{STATUS_LABELS[status]}</span>;
}
