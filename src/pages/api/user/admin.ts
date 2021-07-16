/* eslint-disable import/no-anonymous-default-export */
import { get } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser } from '~/gql/user/mutations';
import gqlClient from '~/helpers/graphql-client';
import { admin } from '~/services/firebase/admin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req?.method;
  if (method === 'GET') {
    try {
      const data = await gqlClient.request(CreateUser, {
        name: 'Admin',
        email: 'admin@app.com',
        role: 'ADMIN',
      });
      const userId = get(data, 'user.id');

      await admin.auth().createUser({
        uid: userId,
        email: 'admin@app.com',
        emailVerified: false,
        password: 'password',
        displayName: 'Admin',
        disabled: false,
      });

      await admin.auth().setCustomUserClaims(userId, {
        role: 'ADMIN',
      });
      return res.status(200).json({ id: userId });
    } catch (error) {
      return res.status(409).send({ error });
    }
  } else {
    return res.status(405).statusMessage;
  }
};
