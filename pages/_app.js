import '../css/style.css';
import '../css/cat.css';
import '../css/form.css';
import 'react-toastify/dist/ReactToastify.css';

import Head from 'next/head';
import Link from 'next/link';
import { ToastContainer } from 'react-toastify';
import Cat from '../components/Cat';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [width, setWidth] = useState(0);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  return (
    <>
      <ToastContainer
        position={width > 768 ? 'top-right' : 'bottom-center'}
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        limit={3}
      />

      <Head>
        <title>Config</title>
      </Head>

      <div className="top-bar">
        <div className="nav">
          {router.pathname !== '/' && (
            <Link href="/">
              <a>Current Config</a>
            </Link>
          )}
        </div>
      </div>

      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>

      <Cat />
    </>
  );
}

export default MyApp;
