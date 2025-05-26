// src/pages/api/[id].ts
import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { id } = req.query;

    try {
        const filePath = path.join(process.cwd(), 'data', 'monster', `${id}.json`);
        const json = await fs.readFile(filePath, 'utf-8');
        const monster = JSON.parse(json);

        res.status(200).json(monster);
    } catch (error) {
        res.status(404).json({ error: 'モンスターが見つかりません' });
    }
}
