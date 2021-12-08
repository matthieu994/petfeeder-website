import Link from 'next/link';
import dbConnect from '../lib/dbConnect';
import Config from '../models/Config';

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
            {config.feed_on.sort().map((data, index) => (
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
  const result = await Config.find({}, {}, { sort: { createdAt: -1 } });
  const configs = result.map((doc) => {
    const config = doc.toObject();
    config._id = config._id.toString();
    config.createdAt = new Date(config.createdAt).getTime();
    config.updatedAt = new Date(config.updatedAt).getTime();
    return config;
  });

  if (configs?.length > 0) {
    return { props: { config: configs[0] } };
  } else {
    return { props: { config: null } };
  }
}

export default Index;
