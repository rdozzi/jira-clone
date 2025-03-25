interface CommentObject {
  authorId: number;
  id: number;
  content: string;
  createdAt: string | Date;
  ticketId: number;
  updatedAt: string | Date;
}

export function sortCommentObjects(arrOfObjects: CommentObject[] | []) {
  arrOfObjects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  console.log(arrOfObjects);
  console.log(typeof arrOfObjects[0].createdAt);

  return arrOfObjects;
}
