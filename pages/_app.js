import '../css/style.css';
import '../css/form.css';
import Head from 'next/head';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Config</title>
      </Head>

      <div className="top-bar">
        <div className="nav">
          <Link href="/">
            <a>Last Config</a>
          </Link>
          <Link href="/new">
            <a>Add Config</a>
          </Link>
        </div>
      </div>

      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
