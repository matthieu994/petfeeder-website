import dbConnect from '../../../lib/dbConnect';
import Config, { SAMPLE_DOC } from '../../../models/Config';
import { feedNow } from './feed_now';

export function formatDocToConfig(doc) {
  const config = doc.toObject();
  config._id = config._id.toString();
  config.createdAt = new Date(config.createdAt).getTime();
  config.updatedAt = new Date(config.updatedAt).getTime();
  config.feed_on = config.feed_on.sort();
  return config;
}

export async function getLastConfig() {
  try {
    const doc = await Config.findOne();

    if (!!doc) {
      return formatDocToConfig(doc);
    } else {
      return createFirstConfig();
    }
  } catch (error) {
    return formatDocToConfig({ toObject: () => SAMPLE_DOC });
  }
}

async function createFirstConfig() {
  const count = await Config.count();

  if (count === 0) {
    try {
      const doc = await Config.create({ feed_on: [] });

      if (!!doc) {
        return formatDocToConfig(doc);
      } else {
        throw new Error('Error while creating first config.');
      }
    } catch (error) {
      throw new Error('Error while creating first config.');
    }
  } else {
    throw new Error('Error while creating first config.');
  }
}

async function editFeedOn(feed_on) {
  const config = await Config.findOne();
  config.feed_on = feed_on;
  await config.save();
  return config;
}

function isESP({ headers }) {
  console.log(headers['user-agent']);
  return String(headers['user-agent'].split('/')[0]).toLowerCase().includes('esp');
}

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      const lastConfig = await getLastConfig();

      if (!!lastConfig?.feed_on) {
        lastConfig.feed_on = lastConfig.feed_on
          .map((feed) => {
            return String(feed).includes(':')
              ? parseInt(feed.split(':')[0]) * 60 + parseInt(feed.split(':')[1])
              : parseInt(feed);
          })
          .sort((a, b) => a - b);

        if (isESP(req)) {
          feedNow(false);
        }

        res.status(200).json({ success: true, data: lastConfig });
      } else {
        res.status(400).json({ success: false });
      }

      break;
    case 'POST':
      try {
        await editFeedOn(req.body.feed_on);

        res.status(201).json({ success: true, message: 'Config updated successfully !' });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }

      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
