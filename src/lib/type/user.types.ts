export type UserType = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

interface IUser extends UserType {
  bio?: string | null | undefined;
  profilePhoto?: string | null | undefined;
  coverPhoto?: string | null | undefined;
  birthdate?: string | null | undefined;
  title?: string | null | undefined;
  themeMode?: string | null | undefined;
  colorMode?: string | null | undefined;
  token?: string | null | undefined;
  followings_count?: number | null | undefined;
  followers_count?: number | null | undefined;
  refreshToken?: string | null | undefined;
  createdAt: NativeDate;
  updatedAt: NativeDate;
}

export default IUser;
