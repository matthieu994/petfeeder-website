import dbConnect from '../lib/dbConnect';
import { getLastConfig } from './api/config';

const Index = ({ config }) => {
  const getDate = (date) =>
    `${new Date(date).toLocaleDateString()} ${new Date(date).toLocaleTimeString()}`;

  return (
    config && (
      <div key={config._id}>
        <p className="config-createdAt">Created on {getDate(config.createdAt)}</p>

        <div className="feed_on info">
          <p className="label">Feed On</p>
          <ul>
            {config.feed_on.map((data, index) => (
              <li key={index}>{data} </li>
            ))}
          </ul>
        </div>
      </div>
    )
  );
};

/* Retrieves config(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const lastConfig = await getLastConfig();
  return { props: { config: lastConfig } };
}

export default Index;
