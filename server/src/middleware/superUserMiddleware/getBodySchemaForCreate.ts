import { RequestHandler } from 'express';
import { boardCreateSchemaSuperUser } from '../../schemas/board.schema';
import { commentCreateSchemaSuperUser } from '../../schemas/comment.schema';
import { projectCreateSchemaSuperUser } from '../../schemas/project.schema';
import { ticketCreateSchemaSuperUser } from '../../schemas/ticket.schema';

export const getBodySchemaForCreate: RequestHandler = (req, res, next) => {
  try {
    const resource = res.locals.validatedParams.resource;
    const resourceEdited = resource.toUpperCase();

    let schema;
    switch (resourceEdited) {
      case 'PROJECT':
        schema = projectCreateSchemaSuperUser;
        break;
      case 'BOARD':
        schema = boardCreateSchemaSuperUser;
        break;
      case 'TICKET':
        schema = ticketCreateSchemaSuperUser;
        break;
      case 'COMMENT':
        schema = commentCreateSchemaSuperUser;
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
