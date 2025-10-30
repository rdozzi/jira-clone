import { memo } from 'react';
import { useDropdown } from '../contexts/DropdownContext';
import { useModal } from '../contexts/useModal';

import { ProjectViewAllProjects } from '../types/Projects';
import { useCreateProject } from '../features/projects/useCreateProject';
import { useDeleteProject } from '../features/projects/useDeleteProject';

import { Dropdown, Button } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { useAttachmentModal } from '../contexts/useAttachmentModal';

// ADJUST PROJECT EDIT SCHEMA TO ALLOW FOR EDITING STATUS, PRIVATE/PUBLIC BOOLEAN, AND OWNER. WILL NEED TO IMPLEMENT A VALID USER'S LIST FOR EDIT MODAL AND STATUS AND IS PROJECT PUBLIC OPTIONS. ADD CONDITIONAL RENDERING FEATURES THAT GIVE THE STATUS AND PUBLIC/NON-PUBLIC FEATURES WEIGHT.

const dropdownItems = [
  {
    key: 'view_edit',
    label: 'View/Edit',
  },
  {
    key: 'duplicate',
    label: 'Duplicate',
  },
  {
    key: 'archive',
    label: 'Archive',
  },
  {
    key: 'attachments',
    label: 'Attachments',
  },
  {
    key: 'delete',
    label: 'Delete',
  },
];

const ProjectViewAllItemButton = memo(function ProjectViewAllItemButton({
  record,
}: {
  record: ProjectViewAllProjects;
}) {
  const { activeDropdown, closeDropdown, toggleDropdown } = useDropdown();
  const { createProject, isCreatingProject, createProjectError } =
    useCreateProject();
  const { deleteProject, isDeletingProject, deleteProjectError } =
    useDeleteProject();
  const { openModal } = useModal();
  const { openModal: openAttachmentModal } = useAttachmentModal();

  const isDropdownOpen = activeDropdown === record.id;

  function handleButtonClick() {
    toggleDropdown(record.id);
  }

  function handleMenuClick(e: { key: string }) {
    const partialProject: Partial<ProjectViewAllProjects> = {
      name: record.name,
      description: record.description,
    };
    switch (e.key) {
      case 'view_edit':
        openModal('viewEdit', { id: record.id, record });
        console.log('View/Edit project:', record);
        break;

      case 'duplicate':
        if (!record || typeof record != 'object') {
          console.error('Invalid record for duplication', record);
          break;
        }
        createProject(partialProject);
        console.log('Duplicate project created:', record);
        break;

      case 'archive':
        console.log('Archive project:', record);
        break;

      case 'attachments':
        openAttachmentModal('PROJECT', { id: record.id, record });
        console.log('Attachments', record);
        break;

      case 'delete':
        deleteProject(record.id);
        console.log('Delete project:', record);
        break;

      default:
        console.log(`Action selected: ${e.key} for project:`, record);
    }
    closeDropdown();
  }

  return (
    <>
      <Dropdown
        menu={{ items: dropdownItems, onClick: handleMenuClick }}
        open={isDropdownOpen}
        trigger={['click']}
        disabled={isDeletingProject || isCreatingProject}
        onOpenChange={(open) => {
          if (!open) closeDropdown();
        }}
      >
        <Button type='text' onClick={handleButtonClick}>
          <EllipsisOutlined />
        </Button>
      </Dropdown>
    </>
  );
});

export default ProjectViewAllItemButton;
