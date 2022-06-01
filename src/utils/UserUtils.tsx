export interface UserModel {
  _id: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  refreshToken?: string;
  accessToken?: string;
  picture?: string;
  summary?: string;
}

export interface UserControlModel extends UserModel {
  isValid: boolean;
}

export const defaultUser: UserModel = {
  _id: '',
  username: '',
  email: '',
  role: 'Learner',
}

export const defaultUserControl: UserControlModel = {
  _id: '',
  username: '',
  email: '',
  role: 'Learner',
  isValid: false,
}

export const testingUserControl1: UserControlModel = {
  _id: '6271ecc975b32c3874cdab89',
  username: 'feenafung72',
  email: 'feenafung72@gmail.com',
  role: 'Learner',
  isValid: true,
}

export const testingUserControl2: UserControlModel = {
  _id: '62959b87f7781d5bb0abdc9f',
  username: 'feenafung7295',
  email: 'feenafung7295@gmail.com',
  role: 'Tutor',
  isValid: true,
}