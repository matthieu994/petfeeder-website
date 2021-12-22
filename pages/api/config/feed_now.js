import { formatDocToConfig } from '.';
import dbConnect from '../../../lib/dbConnect';
import Config from '../../../models/Config';

async function feedNow() {
  const config = await Config.findOne();
  const now = new Date();

  // No previous instant feed
  if (!config.feed_now) {
    config.feed_now = now.getHours() * 60 + now.getMinutes();
  } else {
    const newNow = now.getHours() * 60 + now.getMinutes();

    // If the previous instant feed is more than 1 minute ago
    if (Math.abs(newNow - config.feed_now) >= 1) {
      config.feed_now = newNow;
    } else {
      throw new Error('The previous Instant Feed is too close !');
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
