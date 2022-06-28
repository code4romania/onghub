import React, { useEffect, useState } from 'react';
import { XCircleIcon } from '@heroicons/react/solid';
import { Combobox } from '@headlessui/react';
import PlusIcon from '@heroicons/react/solid/PlusIcon';

const people = [
  { id: 1, name: 'Wade Cooper' },
  { id: 2, name: 'Arlene Mccoy' },
  { id: 3, name: 'Devon Webb' },
  { id: 4, name: 'Tom Cook' },
  { id: 5, name: 'Tanya Fox' },
  { id: 6, name: 'Hellen Schmidt' },
  { id: 7, name: 'Caroline Schultz' },
  { id: 8, name: 'Mason Heaney' },
  { id: 9, name: 'Claudie Smitham' },
  { id: 10, name: 'Emil Schaefer' },
];

interface SearchSelectProps {
  title: string;
  helperText: string;
  readonly?: boolean;
}

interface ChipProps {
  item: ChipItem;
  readonly?: boolean;
  onClick: (itemId: number) => void;
}

interface ChipItem {
  id: number;
  name: string;
}

const Chip = ({ item, readonly, onClick }: ChipProps) => (
  <span
    className="h-9 inline-flex items-center px-5 py-2.5 rounded-full  text-sm  text-gray-800 cursor-pointer font-normal bg-gray-100"
    onClick={() => !readonly && onClick(item.id)}
  >
    {item.name}
    {!readonly && <XCircleIcon className="w-5 h-5 ml-2.5 text-gray-400" />}
  </span>
);

const SearchSelect = ({ title, helperText, readonly }: SearchSelectProps) => {
  const [query, setQuery] = useState('');
  const [selectedValue, setSelectedValue] = useState<ChipItem>();
  const [selectedItems, setSelectedItems] = useState<ChipItem[]>([]);

  useEffect(() => {
    if (selectedValue && selectedItems.findIndex((item) => item.id === selectedValue.id) < 0)
      setSelectedItems([...selectedItems, selectedValue]);
  }, [selectedValue]);

  const filteredItems =
    query === ''
      ? people
      : people.filter((person) => {
          return person.name.toLowerCase().includes(query.toLowerCase());
        });

  const onRemoveSelection = (itemId: number) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== itemId));
  };

  return (
    <Combobox as="div" value={selectedValue} onChange={setSelectedValue}>
      <Combobox.Label className="form-item-label">{title}</Combobox.Label>
      <div className="relative mt-1">
        {!readonly && (
          <>
            <Combobox.Input
              className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
              onChange={(event) => setQuery(event.target.value)}
            />
            <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
              <PlusIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </Combobox.Button>
          </>
        )}
        {filteredItems.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredItems.map((item) => (
              <Combobox.Option
                key={item.id}
                value={item}
                className="relative select-none py-2 pl-8 pr-4 text-gray-900 cursor-pointer hover:bg-green-50"
              >
                <span className="block truncate">{item.name}</span>
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
      {!readonly && <span className="form-item-helper-text text-gray-500">{helperText}</span>}
      <div id="selection" className="py-2 flex gap-x-2 gap-y-2 flex-wrap">
        {selectedItems.map((item) => (
          <Chip key={item.id} item={item} onClick={onRemoveSelection} readonly={readonly} />
        ))}
      </div>
    </Combobox>
  );
};

export default SearchSelect;
