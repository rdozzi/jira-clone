interface CommentObject {
  authorId: number;
  id: number;
  content: string;
  createdAt: string | Date;
  ticketId: number;
  updatedAt: string | Date;
}

export function sortCommentObjects(arrOfObjects: CommentObject[] | []) {
  if (arrOfObjects.length === 0) return [];

  arrOfObjects.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  if (arrOfObjects.length !== 0) {
    console.log(arrOfObjects);
    console.log(typeof arrOfObjects[0].createdAt);
  }

  return arrOfObjects;
}
