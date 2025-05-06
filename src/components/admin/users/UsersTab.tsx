
import React from "react";
import { UsersTabProps } from "./types";

// Temporary implementation for type checking
const UsersTab: React.FC<UsersTabProps> = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          {user.name} - {user.email}
        </div>
      ))}
    </div>
  );
};

export default UsersTab;
