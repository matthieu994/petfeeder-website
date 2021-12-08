import dbConnect from '../../../lib/dbConnect';
import Config from '../../../models/Config';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const doc = await Config.findOne({}, {}, { sort: { createdAt: -1 } });

        if (!!doc) {
          const config = doc.toObject();
          config._id = config._id.toString();
          config.createdAt = new Date(config.createdAt).getTime();
          config.updatedAt = new Date(config.updatedAt).getTime();
          res.status(200).json({ success: true, data: config });
        } else {
          res.status(400).json({ success: false });
        }
      } catch (error) {
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
