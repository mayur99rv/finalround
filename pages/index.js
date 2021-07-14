import Head from "next/head";
import styles from "../styles/Home.module.css";
import Loader from "../components/Loader";
export default function Home() {
  return (
    <div className={styles.container}>
      <Loader show={false}></Loader>
    </div>
  );
}
