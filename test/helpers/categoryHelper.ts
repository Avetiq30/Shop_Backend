import { UserModel } from '../../src/user/user.model';

export const loginDataCat = {
  email: 'testingCategory@mail.ru',
  password: 'test123123',
};
export const userDataCat: UserModel = {
  name: 'test',
  lastname: 'lasttest',
  email: loginDataCat.email,
  password: loginDataCat.password,
  role: undefined,
  phone: '1234567890',
  address: 'erevan',
};
