import bcrypt from "bcryptjs";

// interface User {
//   name: string;
//   email: string;
//   password: string;
//   is_admin: boolean;
// }

const users = [
  {
    name: "Maxim",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "admin",
  },
  {
    name: "Vera",
    email: "user@example.com",
    password: bcrypt.hashSync("123456", 10),
    role: "user",
  },
  // {
  //   name: "Admin User",
  //   email: "admin@email.com",
  //   password: bcrypt.hashSync("123456", 10),
  //   is_admin: true,
  // },
  // {
  //   name: "John Smith",
  //   email: "john@email.com",
  //   password: bcrypt.hashSync("123456", 10),
  //   is_admin: false,
  // },
  // {
  //   name: "Jane Smith",
  //   email: "jane@email.com",
  //   password: bcrypt.hashSync("123456", 10),
  //   is_admin: false,
  // },
];

export default users;
