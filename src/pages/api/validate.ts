/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { validate } from '~/services/firebase/admin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { token } = req.body || {};
    if (!token) {
      return res.status(403).send({
        errorCode: 403,
        message: 'Auth token missing.',
      });
    }
    const result = await validate(token);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(err.code).send({
      errorCode: err.code,
      message: err.message,
    });
  }
};
