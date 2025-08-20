import { RequestHandler } from 'express';
import { boardUpdateSchemaSuperUser } from '../../schemas/board.schema';
import { commentUpdateSchemaSuperUser } from '../../schemas/comment.schema';
import { projectUpdateSchemaSuperUser } from '../../schemas/project.schema';
import { ticketUpdateSchemaSuperUser } from '../../schemas/ticket.schema';

export const getBodySchemaForUpdate: RequestHandler = (req, res, next) => {
  try {
    const resource = res.locals.validatedParams.resource;
    const resourceEdited = resource.toUpperCase();

    let schema;
    switch (resourceEdited) {
      case 'PROJECT':
        schema = projectUpdateSchemaSuperUser;
        break;
      case 'BOARD':
        schema = boardUpdateSchemaSuperUser;
        break;
      case 'TICKET':
        schema = ticketUpdateSchemaSuperUser;
        break;
      case 'COMMENT':
        schema = commentUpdateSchemaSuperUser;
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
