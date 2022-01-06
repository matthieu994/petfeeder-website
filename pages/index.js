import dbConnect from '../lib/dbConnect';
import { getLastConfig } from './api/config';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useState } from 'react';

const Index = ({ config }) => {
  const getDate = (date) =>
    `${new Date(date).toLocaleDateString()} at ${new Date(date).toLocaleTimeString()}`;

  const [disabled, setDisabled] = useState(config.feed_now);

  const feedCat = () => {
    fetch('api/config/feed_now', { method: 'POST' }).then(async (res) => {
      setDisabled(true);
      const json = await res.json();
      if (res.ok) toast.success(`${json.message}`);
      else toast.error(`${json.message}`);
    });
  };

  return (
    <div className="home-container">
      <div className="feed-now">
        <button className="btn" onClick={feedCat} disabled={disabled}>
          😻 Feed Now 😻
        </button>
      </div>
      {config && (
        <div key={config._id} id="config">
          <p className="config-updatedAt">Updated : {getDate(config.updatedAt)}</p>

          <div className="feed_on info">
            <Link className="edit" href="/edit">
              ✏️
            </Link>
            <p>⏲️ Feed On ⏲️</p>
            <ul>
              {config.feed_on.map((data, index) => (
                <li key={index}>{data} </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

/* Retrieves config(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const lastConfig = await getLastConfig();
  return { props: { config: lastConfig, disabled: lastConfig.feed_now } };
}

export default Index;
