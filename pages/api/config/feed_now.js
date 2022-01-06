import { formatDocToConfig } from '.';
import dbConnect from '../../../lib/dbConnect';
import Config from '../../../models/Config';

export async function feedNow(doesFeedNow = true) {
  const config = await Config.findOne();

  // No previous instant feed
  if (config.feed_now !== doesFeedNow || config.feed_now === null) {
    config.feed_now = doesFeedNow;
  } else {
    if (doesFeedNow === true && config.feed_now === true) {
      throw new Error('The previous Instant Feed was not fulfilled !');
    }
  }

  config.save();
  return formatDocToConfig(config);
}

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        await feedNow();
        res.status(201).json({ success: true, message: 'Instant Feed successful !' });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }

      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
