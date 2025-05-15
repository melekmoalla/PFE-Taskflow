const ACTION = {
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  COPY: 'COPY',
};

export const generateLogMessage = (log: any) => {
  const { action, entityTitle, entityType, action_description, entityBoard } = log;

  const entity = entityType.toLowerCase();
  const boardFormatted = entityBoard ? `the board "${entityBoard}"` : 'a board';

  // Helper to format log message consistently
  const formatMessage = (verb: string) => {
    if (action_description) {
      return `${verb} ${entity} "${entityTitle}" for ${boardFormatted} with ${action_description} .`;
    }

    if (entityType === 'COMMENT') {
      return `${verb} ${entity} for ${boardFormatted}.`;
    }

    if (entityType === 'BOARD') {
      return `${verb} ${entity} "${entityTitle}".`;
    }

    return `${verb} ${entity} "${entityTitle}" for ${boardFormatted}.`;
  };

  switch (action) {
    case ACTION.CREATE:
      return formatMessage("Created");
    case ACTION.UPDATE:
      return formatMessage("Updated");
    case ACTION.DELETE:
      return formatMessage("Deleted");
    case ACTION.COPY:
      return formatMessage("Copied");
    default:
      return `Performed unknown action on ${entity} "${entityTitle}".`;
  }
};
