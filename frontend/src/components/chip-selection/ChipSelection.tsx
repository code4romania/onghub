import React, { useState, useEffect } from 'react';
import CheckIcon from '@heroicons/react/solid/CheckIcon';
import { classNames } from '../../common/helpers/tailwind.helper';

interface ChipSelectionProps {
  title: string;
  error: string;
  helperText: string;
  values: ChipItem[];
  readonly?: boolean;
  defaultItems?: number[];
  onItemsChange: (items: number[]) => void;
}

interface ChipProps {
  item: ChipItem;
  selected?: boolean;
  readonly?: boolean;
  onClick: (itemId: number) => void;
}

interface ChipItem {
  id: number;
  name: string;
}

const Chip = ({ item, selected, readonly, onClick }: ChipProps) => (
  <span
    className={classNames(
      selected ? 'font-semibold bg-green-50' : 'font-normal bg-gray-100',
      'h-9 inline-flex items-center px-5 py-2.5 rounded-full  text-sm  text-gray-800 cursor-pointer',
    )}
    onClick={() => !readonly && onClick(item.id)}
  >
    {item.name}
    {selected && <CheckIcon className="w-5 h-5 ml-2.5 text-green" />}
  </span>
);

const ChipSelection = ({
  title,
  helperText,
  defaultItems,
  onItemsChange,
  values,
  error,
  readonly,
}: ChipSelectionProps) => {
  const [selectedItems, setSelectedItems] = useState<number[]>(defaultItems || []);

  useEffect(() => {
    onItemsChange(selectedItems);
  }, [selectedItems]);

  const isSelected = (itemId: number): boolean => {
    return selectedItems.findIndex((id) => id === itemId) >= 0;
  };

  const onChipItemClick = (itemId: number) => {
    if (selectedItems.findIndex((id) => id === itemId) >= 0) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  return (
    <div className="w-[500px]">
      <div className="font-normal text-base text-gray-700">{title}</div>
      <div className="py-2 flex gap-x-2 gap-y-2 flex-wrap">
        {values.map((item) => (
          <Chip
            key={item.id}
            item={item}
            readonly={readonly}
            selected={isSelected(item.id)}
            onClick={onChipItemClick}
          />
        ))}
      </div>
      <div className={classNames(error ? 'text-red-500' : 'text-gray-500', 'text-sm font-normal')}>
        {error || helperText}
      </div>
    </div>
  );
};

export default ChipSelection;
