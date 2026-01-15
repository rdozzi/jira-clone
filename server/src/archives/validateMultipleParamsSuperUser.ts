// import { Request, Response, NextFunction } from 'express';
// import { numberIdSchema, resourceSchema } from '../schemas/base.schema';
// import { z, ZodError } from 'zod';

// const stringPattern = /^[A-Za-z]+$/;
// const numberPattern = /^[1-9][0-9]*$/;

// export function validateMultipleParamsSuperUser(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const entityKeys = Object.keys(req.params);
//   const results: { [key: string]: number | string } = {};

//   for (const entityKey of entityKeys) {
//     let result;

//     if (numberPattern.test(req.params[entityKey])) {
//       result = numberIdSchema.safeParse(req.params[entityKey]);

//       if (!result!.success) {
//         const error: ZodError = result!.error;
//         const prettifiedError = z.prettifyError(error);
//         res.status(400).json({
//           error: 'Validation failed',
//           message: prettifiedError,
//         });
//         return;
//       }

//       results[entityKey] = result.data;
//     } else if (
//       stringPattern.test(req.params[entityKey]) &&
//       req.params[entityKey] !== undefined
//     ) {
//       result = resourceSchema.safeParse(req.params[entityKey]);

//       if (!result!.success) {
//         const error: ZodError = result!.error;
//         const prettifiedError = z.prettifyError(error);
//         res.status(400).json({
//           error: 'Validation failed',
//           message: prettifiedError,
//         });
//         return;
//       }

//       results[entityKey] = result.data;
//     } else if (
//       entityKey === 'recordId' &&
//       req.params[entityKey] === undefined
//     ) {
//       continue; //Edge case specific for superUserFunctionController
//     }
//   }

//   res.locals.validatedParams = results;
//   next();
// }
