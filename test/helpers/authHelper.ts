import { UserModel } from '../../src/user/user.model';

export const loginData = {
  email: 'testAuth@mail.ru',
  password: 'test123123',
};
export const user: UserModel = {
  name: 'test',
  lastname: 'lasttest',
  email: loginData.email,
  password: loginData.password,
  role: undefined,
  phone: '1234567890',
  address: 'erevan',
};
