import { useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

interface ToolbarProps {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ darkMode, setDarkMode }) => {
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="h-12 w-full shadow-xl border-b-2 dark:border-stone-900 bg-stone-100 dark:bg-stone-900 text-bg-stone-900 dark:text-stone-100 flex items-center justify-end px-2">
      <button
        onClick={handleToggle}
        className="p-2 border-2 border-stone-900 dark:border-stone-100"
      >
        {darkMode ? <FaSun /> : <FaMoon />}
      </button>
    </div>
  );
};
