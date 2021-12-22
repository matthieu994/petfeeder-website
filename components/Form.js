import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

const Form = ({ formId, lastConfig }) => {
  const router = useRouter();
  const contentType = 'application/json';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();
  const [indexes, setIndexes] = useState([{ index: 1, value: null }]);
  const [counter, setCounter] = useState(1);
  const toastId = useRef(null);

  const getFieldName = (index) => `config_${index}`;

  useEffect(() => {
    if (lastConfig?.feed_on.length > 0) {
      setIndexes([]);
      setCounter(0);

      lastConfig.feed_on.forEach((feed, index) => {
        addFeed(feed, index);
      });

      const initValues = lastConfig.feed_on.map((feed, index) => {
        return {
          [getFieldName(index)]: feed,
        };
      });
      reset(...initValues);
    }
  }, [lastConfig]);

  /* The POST method adds a new entry in the mongodb database. */
  const postData = async (data) => {
    try {
      toastId.current = toast('Updating config...', {
        autoClose: false,
      });

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

      const json = await res.json();
      toast.update(toastId.current, {
        type: res.ok ? toast.TYPE.SUCCESS : toast.TYPE.ERROR,
        render: `${json.message}`,
        autoClose: 5000,
      });

      router.push('/');
    } catch (error) {
      toast.error(`${json.message}`);
    }
  };

  const onSubmit = (data) => {
    const dataToSubmit = {
      feed_on: indexes.map((item) => data[`${getFieldName(item.index)}`]),
    };
    postData(dataToSubmit);
  };

  const addFeed = (value = null, index = null) => {
    setIndexes((prevIndexes) => [
      ...prevIndexes,
      { index: index === null ? counter + 1 : index, value: value },
    ]);
    setCounter((prevCounter) => prevCounter + 1);
  };

  const removeFeed = (index) => {
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
    <form id={formId} onSubmit={handleSubmit(onSubmit)}>
      <div className="button-container">
        <button type="button" onClick={() => addFeed()} className="btn">
          Add
        </button>
        <button type="button" onClick={() => clearFeeds()} className="btn">
          Clear
        </button>

        <input type="submit" className="btn" value="Submit" />
      </div>

      <div className="fieldset-container">
        {indexes.map(({ index, value }) => {
          const fieldName = `${getFieldName(index)}`;

          return (
            <fieldset key={fieldName}>
              <label htmlFor={fieldName}>Feed on : </label>
              <input
                type="time"
                name={fieldName}
                id={fieldName}
                defaultValue={value !== null ? value : ''}
                required
                {...register(fieldName, { required: true })}
              />

              <button
                type="button"
                className="btn small"
                onClick={() => removeFeed(index)}
              >
                Remove
              </button>
            </fieldset>
          );
        })}
      </div>
    </form>
  );
};

export default Form;
