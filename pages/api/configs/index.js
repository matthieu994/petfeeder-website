import dbConnect from '../../../lib/dbConnect';
import Config from '../../../models/Config';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const configs = await Config.find({}); /* find all the data in our database */
        res.status(200).json({ success: true, data: configs });
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
