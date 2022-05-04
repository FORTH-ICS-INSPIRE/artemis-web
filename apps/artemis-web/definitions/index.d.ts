import { NextApiRequest, NextApiResponse } from 'next';

export interface NextApiRequestExtended extends NextApiRequest {
  db?: any;
  user: any;
  ip?: string;
  logIn(user: any, arg1: (err: any) => void);
  logOut();
}

export interface NextApiResponseExtended extends NextApiResponse {
  send(arg0: any);
  cookie(
    arg0: string,
    token: string,
    arg2: {
      path?: string;
      httpOnly?: boolean;
      maxAge?: number;
      sameSite?: string;
      secure?: boolean;
    }
  );
  header(string, string);
  status(number);
  clearCookie(string);
}
