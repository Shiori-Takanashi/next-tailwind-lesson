import { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs/promises';

let lastId: number | null = null;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        let id: number;
        do {
            id = Math.floor(Math.random() * 10) + 1;
        } while (id === lastId);

        lastId = id; // 生成したIDを記録

        const filePath = path.join(process.cwd(), 'data', 'monster', `${id}.json`);
        const json = await fs.readFile(filePath, 'utf-8');
        const monster = JSON.parse(json);

        res.setHeader('Cache-Control', 'no-store');
        res.status(200).json(monster);
    } catch (error) {
        res.status(500).json({ error: '読み込み失敗' });
    }
}
