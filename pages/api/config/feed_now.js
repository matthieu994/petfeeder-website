import { getLastConfig } from '.';
import dbConnect from '../../../lib/dbConnect';

async function feedNow() {
  const config = await getLastConfig();
  const now = new Date();

  // No previous instant feed
  if (!config.feed_now) {
    config.feed_now = now.getHours() * 60 + now.getMinutes();
  } else {
    const newNow = now.getHours() * 60 + now.getMinutes();

    // If the previous instant feed is more than 1 minute ago
    if (newNow > config.feed_now + 1) {
      config.feed_now = newNow;
    }
  }

  return config;
}

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'POST':
      try {
        const data = await feedNow();
        res.status(201).json({ success: true, data });
      } catch (error) {
        res.status(400).json({ success: false });
      }

      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
