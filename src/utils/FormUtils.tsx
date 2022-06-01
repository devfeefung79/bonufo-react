/* Search Form */

export interface SearchForm {
  keyword: string;
  topic: Array<string>;
  questionType: Array<string>;
  exam: Array<string>;
}

export const defaultSearchForm = {
  keyword: '',
  topic: [],
  questionType: [],
  exam: [],
}

export interface DropdownOption {
  key: string;
  text: string;
  value: string;
}

export interface SearchFormRequestBody {
  keyword?: string;
  topic?: Array<string>;
  questionType?: Array<string>;
  exam?: Array<string>;
}

/* Login Form */

export interface LoginForm {
  usernameEmail: string;
  password: string;
}

export const defaultLoginForm = {
  usernameEmail: '',
  password: '',
}

export const defaultLoginFormControl = {
  usernameEmail: false,
  password: false,
  messageList: [],
  isLoading: false
};

export interface LoginFormRequestBody {
  username?: string;
  email?: string;
  password?: string;
}


/* Register Form */

export interface RegisterForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
  termCondition: boolean;
}

interface Role {
  learner: boolean;
  tutor: boolean;
}

export const defaultRegisterForm = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: {
    learner: false,
    tutor: false,
  },
  termCondition: false,
}

export const defaultRegisterFormControl = {
  username: false,
  email: false,
  password: false,
  confirmPassword: false,
  role: false,
  termCondition: false,
  messageList: [],
  isLoading: false
};

export interface RegisterFormRequestBody {
  username: string;
  email: string;
  password: string;
  role: string;
}