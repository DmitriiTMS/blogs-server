enum HttpStatuses {
  Success = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  ServerError = 500,
}

export enum ResultStatus {
  Success = "Success",
  NotFound = "NotFound",
  Forbidden = "Forbidden",
  Unauthorized = "Unauthorized",
  BadRequest = "BadRequest",
}

type ExtensionType = {
  field: string | null;
  message: string;
};

type Result<T = null> = {
  status: ResultStatus;
  errorMessage?: string;
  extensions: ExtensionType[];
  data: T;
};

// export const resultCodeToHttpException = (resultCode: ResultStatus): number => {
//   switch (resultCode) {
//     case ResultStatus.BadRequest:
//       return HttpStatuses.BadRequest;
//     case ResultStatus.Forbidden:
//       return HttpStatuses.Forbidden;
//     default:
//       return HttpStatuses.ServerError;
//   }
// };
