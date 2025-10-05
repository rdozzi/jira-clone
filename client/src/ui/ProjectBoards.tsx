// import { useState, useEffect } from 'react';
import { useProjectInfo } from '../contexts/useProjectInfo';
import { useGetBoardsByProjectId } from '../features/boards/useGetBoardsByProjectId';
import { Spin } from 'antd';
import { Boards } from '../types/Boards';

function ProjectBoards() {
  const { projectIdNumber } = useProjectInfo();
  const {
    isLoading: isBoardLoading,
    boards,
    error,
  } = useGetBoardsByProjectId(projectIdNumber);

  if (isBoardLoading)
    return (
      <p>
        <Spin />
      </p>
    );
  if (error) return <p>Error Loading Projects!</p>;

  return (
    <>
      <div>ProjectBoards Page!</div>
      <div>
        {boards?.map((board: Boards) => (
          <>
            <div key={board.id}>
              <div>Name: {board.name}</div>
              <div>Description: {board.description}</div>
            </div>
          </>
        ))}
      </div>
    </>
  );
}

export default ProjectBoards;
