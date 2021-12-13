import '../css/style.css';
import '../css/form.css';
import '../css/cat.css';
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
            <a>Current Config</a>
          </Link>
          <Link href="/edit">
            <a>Edit Config</a>
          </Link>
        </div>
      </div>

      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>

      <div className="cat">
        <div className="ear ear--left"></div>
        <div className="ear ear--right"></div>
        <div className="face">
          <div className="eye eye--left">
            <div className="eye-pupil"></div>
          </div>
          <div className="eye eye--right">
            <div className="eye-pupil"></div>
          </div>
          <div className="muzzle"></div>
        </div>
      </div>
    </>
  );
}

export default MyApp;
