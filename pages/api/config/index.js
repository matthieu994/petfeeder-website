import dbConnect from '../../../lib/dbConnect';
import Config from '../../../models/Config';

export async function getLastConfig() {
  try {
    const doc = await Config.findOne({}, {}, { sort: { createdAt: -1 } });

    if (!!doc) {
      const config = doc.toObject();
      config._id = config._id.toString();
      config.createdAt = new Date(config.createdAt).getTime();
      config.updatedAt = new Date(config.updatedAt).getTime();
      config.feed_on = config.feed_on.sort();
      return config;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      const lastConfig = await getLastConfig();
      if (lastConfig !== null) {
        res.status(200).json({ success: true, data: lastConfig });
      } else {
        res.status(400).json({ success: false });
      }

      break;
    case 'POST':
      try {
        const newConfig = await Config.create(
          req.body
        ); /* create a new model in the database */

        res.status(201).json({ success: true, data: newConfig });
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
