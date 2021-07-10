/* eslint-disable import/no-anonymous-default-export */
import { get } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import gqlClient from '~/helpers/graphql-client';
import { CreateUser } from '../../../gql/user/mutations';
import { admin } from '../firebase/admin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req?.method;
  const variables = req?.body;
  if (method === 'POST') {
    try {
      const data = await gqlClient.request(CreateUser, {
        name: variables?.name,
        email: variables?.email,
        role: variables?.role,
      });
      const userId = get(data, 'insert_users.returning.0.id');

      await admin.auth().createUser({
        uid: userId,
        email: variables?.email,
        emailVerified: false,
        password: variables?.password,
        displayName: variables?.name,
        disabled: false,
      });

      await admin.auth().setCustomUserClaims(userId, {
        role: variables?.role,
      });
      return res.status(200).json({ id: userId });
    } catch (error) {
      return res.status(409).json({ error });
    }
  } else {
    return res.status(405).statusMessage;
  }
};
