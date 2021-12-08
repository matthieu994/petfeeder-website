import { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const Form = ({ formId }) => {
  const router = useRouter();
  const contentType = 'application/json';

  const [message, setMessage] = useState('');
  const { register, handleSubmit } = useForm();
  const [indexes, setIndexes] = useState([0]);
  const [counter, setCounter] = useState(1);

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (data) => {
    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          Accept: contentType,
          'Content-Type': contentType,
        },
        body: JSON.stringify(data),
      });

      // Throw error with status code in case Fetch API req failed
      if (!res.ok) {
        throw new Error(res.status);
      }

      router.push('/');
    } catch (error) {
      setMessage('Failed to add config');
    }
  };

  const onSubmit = (data) => {
    const dataToSubmit = { feed_on: indexes.map((index) => data.config[index]) };
    postData(dataToSubmit);
  };

  const addFeed = () => {
    setIndexes((prevIndexes) => [...prevIndexes, counter]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  const removeFeed = (index) => () => {
    setIndexes((prevIndexes) => [...prevIndexes.filter((item) => item !== index)]);
  };

  const clearFeeds = () => {
    setIndexes([]);
  };

  return (
    <>
      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="button-container">
          <button type="button" onClick={addFeed} className="btn">
            Add
          </button>
          <button type="button" onClick={clearFeeds} className="btn">
            Clear
          </button>

          <button type="submit" className="btn">
            Submit
          </button>
        </div>

        {indexes.map((index) => {
          const fieldName = `config[${index}]`;
          return (
            <fieldset name={fieldName} key={fieldName}>
              <label htmlFor="feed_on">Feed On</label>
              <input
                type="time"
                name={fieldName}
                required
                {...register(fieldName, { required: true })}
              />

              <button type="button" className="btn small" onClick={removeFeed(index)}>
                Remove
              </button>
            </fieldset>
          );
        })}
      </form>
      <p>{message}</p>
    </>
  );
};

export default Form;
