"use client";

import { Menu, Transition } from "@headlessui/react";
import { Fragment, MouseEventHandler, useContext } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ShowCorrectAlternativesContext } from "@/contexts/show-correct-alternatives";

export default function OptionsDropdown() {
  const [showCorrectAlternatives, setShowCorrectAlternatives] = useContext(
    ShowCorrectAlternativesContext
  );
  const checkboxClicked: MouseEventHandler = (event) => {
    event.preventDefault();
    setShowCorrectAlternatives(!showCorrectAlternatives);
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        // onClick={() => setIsOpen(!isOpen)}
        className="inline-flex w-full justify-center rounded-md px-4 py-2 hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75"
      >
        Opções
        <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5 " aria-hidden="true" />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item as="span" className={"select-none"} onClick={checkboxClicked}>
              {({ active }) => (
                <label
                  className={`${
                    active ? "bg-slate-600 text-white" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <input
                    type="checkbox"
                    checked={showCorrectAlternatives}
                    className="mr-2"
                  />
                  Mostrar n° de alternativas corretas por questão
                </label>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
