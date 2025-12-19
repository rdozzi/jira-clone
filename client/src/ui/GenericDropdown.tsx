import { Select } from 'antd';

type DropdownItem = {
  id: number;
  name: string;
};

type GenericDropdownProps<T extends DropdownItem> = {
  option: T | null;
  options: T[];
  setSelected: React.Dispatch<React.SetStateAction<T | null>>;
  isSelectedLoading: boolean;
  isProjectInfoView?: boolean;
};

export function GenericDropdown<T extends DropdownItem>({
  option,
  options,
  setSelected,
  isSelectedLoading,
  isProjectInfoView,
}: GenericDropdownProps<T>) {
  return (
    <Select
      style={{ width: '100%', textAlign: 'left' }}
      value={option?.id}
      loading={isSelectedLoading}
      size={'middle'}
      disabled={isProjectInfoView}
      onChange={(id) => {
        const selectedProject = options?.find((o) => o.id === id) || null;
        setSelected(selectedProject);
      }}
    >
      {options?.map((option) => {
        return (
          <Select.Option key={option.id} value={option.id}>
            {option.name}
          </Select.Option>
        );
      })}
    </Select>
  );
}
