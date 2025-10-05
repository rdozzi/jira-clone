// import { useState, useEffect } from 'react';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { useGetBoardsByProjectId } from '../features/boards/useGetBoardsByProjectId';
import { Spin } from 'antd';
import { Boards } from '../types/Boards';

function ProjectBoards() {
  const { projectIdNumber } = useProjectInfo();
  const { isLoading: isBoardLoading, boards } =
    useGetBoardsByProjectId(projectIdNumber);

  console.log(projectIdNumber);
  console.log(boards);

  return (
    <>
      <div>ProjectBoards Page!</div>
      {isBoardLoading ? (
        <Spin />
      ) : (
        boards?.map((board: Boards) => (
          <>
            <div key={board.id}>
              <div>Name: {board.name}</div>
              <div>Description: {board.description}</div>
            </div>
          </>
        ))
      )}
    </>
  );
}

export default ProjectBoards;
