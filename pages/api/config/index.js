import dbConnect from '../../../lib/dbConnect';
import Config from '../../../models/Config';

function formatDocToConfig(doc) {
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
    return null;
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
        return null;
      }
    } catch (error) {
      return null;
    }
  } else {
    return null;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      const lastConfig = await getLastConfig();

      lastConfig.feed_on = lastConfig.feed_on.map((feed) => {
        return parseInt(feed.split(':')[0]) * 60 + parseInt(feed.split(':')[1]);
      });

      if (lastConfig !== null) {
        res.status(200).json({ success: true, data: lastConfig });
      } else {
        res.status(400).json({ success: false });
      }

      break;
    case 'POST':
      try {
        const config = await Config.findOne();
        console.log(config.feed_on, req.body.feed_on);
        config.feed_on = req.body.feed_on;
        await config.save();

        res.status(201).json({ success: true, data: formatDocToConfig(config) });
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
