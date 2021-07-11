/* eslint-disable import/no-anonymous-default-export */
import type { NextApiRequest, NextApiResponse } from 'next';
import { DeleteUser } from '~/gql/user/mutations';
import gqlClient from '~/helpers/graphql-client';
import { admin } from '~/services/firebase/admin';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const method = req?.method;
  const { id } = req?.query;
  if (method === 'DELETE') {
    try {
      await gqlClient.request(DeleteUser, { id });
      await admin.auth().deleteUser(id?.toString());
      return res.status(200).json({ success: true });
    } catch (error) {
      res.status(409).json({ error });
    }
  } else {
    return res.status(405).statusMessage;
  }
};
