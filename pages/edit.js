import Form from '../components/Form';
import dbConnect from '../lib/dbConnect';
import { getLastConfig } from './api/config';

const EditConfig = ({ config }) => {
  return <Form formId="edit-config-form" lastConfig={config} />;
};

/* Retrieves config(s) data from mongodb database */
export async function getServerSideProps() {
  await dbConnect();

  /* find all the data in our database */
  const lastConfig = await getLastConfig();
  return { props: { config: lastConfig } };
}

export default EditConfig;
