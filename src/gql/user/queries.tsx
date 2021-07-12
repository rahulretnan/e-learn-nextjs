import { gql } from 'urql/core';

export const GetUserProfile = gql`
  query getUserProfile($user_id: uuid!) {
    users(where: { id: { _eq: $user_id } }) {
      parents {
        id
      }
      students {
        id
      }
      teachers {
        id
      }
      user_details {
        profile_picture
      }
    }
  }
`;
