import { UserModel } from '../../src/user/user.model';

export const loginData = {
  email: 'test@mail.ru',
  password: 'test123',
};
export const user: UserModel = {
  name: 'test',
  lastname: 'lasttest',
  email: loginData.email,
  password: loginData.password,
};
