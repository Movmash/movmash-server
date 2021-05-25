const users = [];
const addUser = ({
  id,
  userName,
  room,
  host,
  fullName,
  profileImageUrl,
  watchSecond,
  userId,
}) => {
  //   name = name.trim().toLowerCase();
  //   room = room.trim().toLowerCase();

  //   const existingUser = users.find(
  //     (user) => user.room === room && user.name === name
  //   );

  //   if (!name || !room) return { error: "Username and room are required." };
  //   if (existingUser) return { error: "Username is taken." };

  const user = {
    id,
    userName,
    room,
    host,
    fullName,
    profileImageUrl,
    watchSecond,
    userId,
  };

  users.push(user);
  console.log(user);
  return { user };
};

const updateWatchSecond = (id, watchSecond) => {
  const index = users.findIndex(data => data.id === id);
  // console.log(id)
  // console.log(index)
  if (index !== -1)  users[index].watchSecond = watchSecond;
  return users[index];
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUserDetail = (id) => {
  return users.find((user) => user.id === id);
};

const getHostDetail = (room) => {
  return users.find((user) => user.room === room && user.host === true);
};

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

module.exports = {
  addUser,
  removeUser,
  getUserDetail,
  getUsersInRoom,
  getHostDetail,
  updateWatchSecond,
};
