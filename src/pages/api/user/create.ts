/* eslint-disable import/no-anonymous-default-export */
import { get, omit } from 'lodash';
import type { NextApiRequest, NextApiResponse } from 'next';
import { CreateUser } from '~/gql/user/mutations';
import gqlClient from '~/helpers/graphql-client';
import { admin } from '~/services/firebase/admin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req?.method;
  const variables = req?.body;
  const details = omit(variables, ['name', 'email', 'role', 'password']);
  if (method === 'POST') {
    try {
      const data = await gqlClient.request(CreateUser, {
        name: variables?.name,
        email: variables?.email,
        role: variables?.role,
        data: details,
      });
      const userId = get(data, 'user.id');

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
      return res.status(409).send({ error });
    }
  } else {
    return res.status(405).statusMessage;
  }
};
