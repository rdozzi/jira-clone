import { Request, Response, NextFunction } from 'express';

export function checkHoneypot() {
  return async (req: Request, res: Response, next: NextFunction) => {
    //Currently stubbed until design is implemented. Will include a fake name and email. User will be automatically blocked if these fields are filled out.
    /*
    https://dev.to/felipperegazio/how-to-create-a-simple-honeypot-to-protect-your-web-forms-from-spammers--25n8
    <label class="ohnohoney" for="name"></label>
    <input class="ohnohoney" autocomplete="off" type="text" id="name" name="name" placeholder="Your name here">
    <label class="ohnohoney" for="email"></label>
    <input class="ohnohoney" autocomplete="off" type="email" id="email" name="email" placeholder="Your e-mail here">
  */
    next();
  };
}
