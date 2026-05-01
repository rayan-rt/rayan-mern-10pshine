type IUser = {
  _id: string;
  username: string;
  email: string;
  isVerified: boolean;
  notesCount?: number;
  pinnedNotesCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

type IAuthResponse = {
  success: boolean;
  message: string;
  data?: IUser;
};

type ILoginCredentials = Pick<IUser, "username"> & {
  password?: string;
};

type IRegisterCredentials = Omit<
  IUser,
  "_id" | "isVerified" | "createdAt" | "updatedAt"
> & {
  password?: string;
};

type IVerifyEmailCredentials = {
  email: string;
  otp: string;
};

type IUpdateProfileData = Partial<Pick<IUser, "username">>;

type IChangePasswordData = {
  oldPassword?: string;
  newPassword?: string;
};

type IUserContext = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  register: (data: IRegisterCredentials) => Promise<IAuthResponse>;
  login: (data: ILoginCredentials) => Promise<IAuthResponse>;
  logout: () => Promise<void>;
  verifyEmail: (data: IVerifyEmailCredentials) => Promise<IAuthResponse>;
  updateProfile: (data: IUpdateProfileData) => Promise<IAuthResponse>;
  forgotPassword: (email: string) => Promise<IAuthResponse>;
  resetPassword: (token: string, password: string) => Promise<IAuthResponse>;
  changePassword: (data: IChangePasswordData) => Promise<IAuthResponse>;
  deleteUser: () => Promise<IAuthResponse>;
};

export type {
  IAuthResponse,
  IChangePasswordData,
  ILoginCredentials,
  IRegisterCredentials,
  IUpdateProfileData,
  IUser,
  IUserContext,
  IVerifyEmailCredentials,
};
