import { RequestHandler } from 'express';
import { boardCreateSchema } from '../../schemas/board.schema';
import { commentCreateSchema } from '../../schemas/comment.schema';
import { projectCreateSchema } from '../../schemas/project.schema';
import { ticketCreateSchema } from '../../schemas/ticket.schema';

export const getBodySchemaForCreate: RequestHandler = (req, res, next) => {
  try {
    const resource = res.locals.validatedParams.resource;
    const resourceEdited = resource.toUpperCase();

    let schema;
    switch (resourceEdited) {
      case 'PROJECT':
        schema = projectCreateSchema;
        break;
      case 'BOARD':
        schema = boardCreateSchema;
        break;
      case 'TICKET':
        schema = ticketCreateSchema;
        break;
      case 'COMMENT':
        schema = commentCreateSchema;
        break;
      default:
        throw new Error('Selected resource is not available for creation.');
    }

    res.locals.bodySchema = schema;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(400)
      .json({ error: 'Selected resource is not available for creation.' });
    return;
  }
};
