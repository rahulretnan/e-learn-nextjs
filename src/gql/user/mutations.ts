import { gql } from 'urql/core';

export const CreateUser = gql`
  mutation addUser(
    $name: String!
    $email: String!
    $role: roles_enum!
    $data: [user_details_insert_input!] = {}
  ) {
    user: insert_users_one(
      object: {
        name: $name
        email: $email
        role: $role
        user_details: { data: $data }
      }
    ) {
      id
    }
  }
`;

export const DeleteUser = gql`
  mutation deleteUserById($id: uuid!) {
    delete_users_by_pk(id: $id) {
      id
    }
  }
`;
