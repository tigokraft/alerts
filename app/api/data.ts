import { NextApiRequest, NextApiResponse } from 'next';
import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const dataPath = path.join(process.cwd(), 'public', 'data.json');

  switch (method) {
    case 'GET':
      try {
        const fileContents = await fs.readFile(dataPath, 'utf8');
        res.status(200).json(JSON.parse(fileContents));
      } catch (error) {
        res.status(500).json({ message: 'Error reading data.' });
      }
      break;

    case 'POST':
      try {
        const newData = req.body;
        await fs.writeFile(dataPath, JSON.stringify(newData, null, 2));
        res.status(200).json({ message: 'Data saved successfully.' });
      } catch (error) {
        res.status(500).json({ message: 'Error saving data.' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
