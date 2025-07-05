import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { endpoint, id } = req.query;

  if (!endpoint || !id || typeof endpoint !== 'string' || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid parameters' });
  }

  try {
    const filePath = path.join(process.cwd(), 'data', endpoint, `${id}.json`);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);

    res.status(200).json(jsonData);
  } catch (error) {
    console.error('Error reading file:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
