const { NotFoundError, ValidationError } = require("../errors/AppError");

let users = [
  { id: 1, name: "Dhiraj", email: "dhiraj@gmail.com", age: 25 },
  { id: 2, name: "Rahul",  email: "rahul@gmail.com",  age: 30 },
];

const getAllUsers = async () => {
  return users;
};

const getUserById = async (id) => {
  const user = users.find((u) => u.id === id);
  if (!user) throw new NotFoundError(`User with id ${id} not found`);
  return user;
};

const createUser = async ({ name, email, age }) => {
  if (!name)  throw new ValidationError("Name is required");
  if (!email) throw new ValidationError("Email is required");
  const newUser = { id: Date.now(), name, email, age };
  users.push(newUser);
  return newUser;
};

const updateUser = async (id, data) => {
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) throw new NotFoundError(`User with id ${id} not found`); // ✅ throw not next()
  const { name, email, age } = data;
  users[userIndex] = { ...users[userIndex], name, email, age };
  return users[userIndex];
};

const deleteUser = async (id) => {
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) throw new NotFoundError(`User with id ${id} not found`);
  users.splice(userIndex, 1);
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };