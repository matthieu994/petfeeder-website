import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';

const Form = ({ formId, lastConfig }) => {
  const router = useRouter();
  const contentType = 'application/json';

  const [message, setMessage] = useState('');
  const { register, handleSubmit } = useForm();
  const [indexes, setIndexes] = useState([{ index: 1, value: null }]);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    if (lastConfig?.feed_on.length > 0) {
      setIndexes([]);
      setCounter(0);

      lastConfig.feed_on.forEach((feed, index) => {
        addFeed(feed, index);
      });
    }
  }, [lastConfig]);

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
    const dataToSubmit = { feed_on: indexes.map((item) => data.config[item.index]) };
    postData(dataToSubmit);
  };

  const addFeed = (value = null, index = null) => {
    setIndexes((prevIndexes) => [
      ...prevIndexes,
      { index: index === null ? counter + 1 : index, value: value },
    ]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  const removeFeed = (index) => () => {
    const newIndexes = indexes.filter((item) => item.index !== index);

    if (newIndexes.length > 0) {
      setIndexes([...newIndexes]);
    }
  };

  const clearFeeds = () => {
    setCounter(1);
    setIndexes([{ index: 1, value: null }]);
  };

  return (
    <>
      {message && <p>{message}</p>}

      <form id={formId} onSubmit={handleSubmit(onSubmit)}>
        <div className="button-container">
          <button type="button" onClick={() => addFeed()} className="btn">
            Add
          </button>
          <button type="button" onClick={clearFeeds} className="btn">
            Clear
          </button>

          <button type="submit" className="btn">
            Submit
          </button>
        </div>

        <div className="fieldset-container">
          {indexes.map(({ index, value }) => {
            const fieldName = `config[${index}]`;

            return (
              <fieldset name={fieldName} key={fieldName}>
                <label htmlFor={fieldName}>Feed on : </label>
                <input
                  type="time"
                  name={fieldName}
                  id={fieldName}
                  defaultValue={value !== null ? value : ''}
                  required
                  {...register(fieldName, { required: true })}
                />

                <button type="button" className="btn small" onClick={removeFeed(index)}>
                  Remove
                </button>
              </fieldset>
            );
          })}
        </div>
      </form>
    </>
  );
};

export default Form;
