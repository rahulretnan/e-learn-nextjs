import { gql } from 'urql/core';

export const CreateUser = gql`
  mutation createUser($email: String!, $name: String!, $role: roles_enum!) {
    insert_users(objects: { name: $name, email: $email, role: $role }) {
      returning {
        id
      }
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
