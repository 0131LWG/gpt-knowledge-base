import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonRes } from '@/service/response';
import { connectToDatabase, KB } from '@/service/mongo';
import { authUser } from '@/service/utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  try {
    const { name, tags, avatar } = req.body as {
      name: string;
      tags: string[];
      avatar: string;
    };

    if (!name) {
      throw new Error('缺少参数');
    }

    // 凭证校验
    const { userId } = await authUser({ req, authToken: true });

    await connectToDatabase();

    const { _id } = await KB.create({
      name,
      userId,
      tags,
      avatar
    });

    jsonRes(res, { data: _id });
  } catch (err) {
    jsonRes(res, {
      code: 500,
      error: err
    });
  }
}
