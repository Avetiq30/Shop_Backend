import { UserModel } from '../../src/user/user.model';

export const loginData = {
  email: 'testing@mail.ru',
  password: 'test123',
};
export const userData: UserModel = {
  name: 'test',
  lastname: 'lasttest',
  email: loginData.email,
  password: loginData.password,
};
