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
      <div>
        <Spin />
      </div>
    );
  if (error) return <div>Error Loading Projects!</div>;

  return (
    <>
      <div>ProjectBoards Page!</div>
      <div>
        {boards?.map((board: Boards) => (
          <div key={board.id}>
            <div>Name: {board.name}</div>
            <div>Description: {board.description}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProjectBoards;
