import React, { Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
// v-- THIS IS THE CORRECTED LINE --v
import { CheckIcon, ChevronUpDownIcon as SelectorIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import SpeakButton from './SpeakButton';
import { Link } from 'react-router-dom';

// We'll define our options here to keep the main component clean
const languageOptions = [
  { name: 'English', value: 'en-US' },
  { name: 'Hindi (हिन्दी)', value: 'hi-IN' },
];

const modeOptions = [
  { name: 'Free Chat', value: 'free-chat' },
  { name: 'Roleplay', value: 'roleplay' },
];

const roleplayOptions = [
  { name: '🏫 At School', value: 'At School' },
  { name: '🛒 At the Store', value: 'At the Store' },
  { name: '👨‍👩‍👧 At Home', value: 'At Home' },
];

// A reusable custom dropdown component
function CustomSelect({ label, value, onChange, options }) {
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div>
      <label className="block text-sm font-bold text-slate-400 mb-1">{label}</label>
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-xl bg-slate-700/50 py-3 pl-4 pr-10 text-left text-white shadow-md focus:outline-none focus-visible:border-pink-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-pink-500 sm:text-lg">
            <span className="block truncate">{selectedOption.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-slate-800/80 backdrop-blur-md py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-lg z-20">
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-pink-500/30 text-pink-300' : 'text-slate-200'
                    }`
                  }
                  value={option.value}
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {option.name}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-400">
                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

function ControlPanel(props) {
  const {
    language, setLanguage,
    mode, setMode,
    roleplayTopic, setRoleplayTopic,
    ...speakButtonProps // Pass the rest of the props to SpeakButton
  } = props;

  return (
    <motion.div 
      className="w-full md:w-1/4 bg-slate-800/50 p-6 flex flex-col items-center justify-between border-b-4 md:border-b-0 md:border-r-4 border-slate-700"
      initial={{ x: '-100%' }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
    >
      <div className="w-full">
        <Link to="/" className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-violet-500 bg-clip-text text-transparent mb-10 text-center block">
          SpeakGenie
        </Link>
        <div className="space-y-6">
          <CustomSelect label="Language" value={language} onChange={setLanguage} options={languageOptions} />
          <CustomSelect label="Mode" value={mode} onChange={setMode} options={modeOptions} />
          {mode === 'roleplay' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
              <CustomSelect label="Roleplay Scenario" value={roleplayTopic} onChange={setRoleplayTopic} options={roleplayOptions} />
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="mt-6 md:mt-0 flex justify-center">
        <SpeakButton {...speakButtonProps} />
      </div>
    </motion.div>
  );
}

export default ControlPanel;