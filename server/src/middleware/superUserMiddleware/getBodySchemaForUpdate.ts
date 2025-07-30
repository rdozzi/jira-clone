import { RequestHandler } from 'express';
import { boardUpdateSchema } from '../../schemas/board.schema';
import { commentUpdateSchema } from '../../schemas/comment.schema';
import { projectUpdateSchema } from '../../schemas/project.schema';
import { ticketUpdateSchema } from '../../schemas/ticket.schema';

export const getBodySchemaForUpdate: RequestHandler = (req, res, next) => {
  try {
    const resource = res.locals.validatedParams.resource;
    const resourceEdited = resource.toUpperCase();

    let schema;
    switch (resourceEdited) {
      case 'PROJECT':
        schema = projectUpdateSchema;
        break;
      case 'BOARD':
        schema = boardUpdateSchema;
        break;
      case 'TICKET':
        schema = ticketUpdateSchema;
        break;
      case 'COMMENT':
        schema = commentUpdateSchema;
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
