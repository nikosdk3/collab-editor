import { Circle, Users } from "lucide-react";

const ActiveUsers = ({ users, currentUser }) => {
  if (!users || users.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-3 border-b border-gray-300 bg-white p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <Users size={16} />
        <span>Active users:</span>
      </div>
      <div className="flex gap-2">
        {users.map((user) => (
          <div
            key={user.socketId}
            className="flex items-center gap-2 rounded-full px-3 py-1 text-sm"
            style={{
              backgroundColor: `${user.color}20`,
              borderLeft: `3px solid ${user.color}`,
            }}
          >
            <Circle size={8} fill={user.color} color={user.color} />
            <span className="font-medium">
              {user.username}
              {user.socketId === currentUser?.socketId && " (You)"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveUsers;
