import { ObjectId } from "mongodb";

export type RequestLoginUser = {
  loginOrEmail: string;
  password: string;
};

export type RequestRegisterUser = {
  login: string;
  email: string;
  password: string;
};

export type ResponseCodeUser = {
  _id: ObjectId;
  login: string;
  password: string;
  email: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};
