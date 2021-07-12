import { gql } from 'urql/core';

export const GetTeachersProfile = gql`
  query getTeacherProfile($user_id: uuid!) {
    teachers(where: { user_id: { _eq: $user_id } }) {
      id
      user {
        user_details {
          profile_picture
        }
      }
    }
  }
`;
