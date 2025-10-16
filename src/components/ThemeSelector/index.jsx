import { Button } from '@components/ui';
import useTheme from '@hooks/useTheme';
import styles from './theme-selector.module.scss';
import iconsMap from '@utils/iconsMap';

const ThemeSelector = () => {
  const { mode, changeTheme } = useTheme();

  const handleThemeToggle = () => {
    // Cycle through: light -> dark -> auto -> light
    if (mode === 'light') {
      changeTheme('dark');
    } else if (mode === 'dark') {
      changeTheme('auto');
    } else {
      changeTheme('light');
    }
  };

  const getIcon = () => {
    if (mode === 'light') return iconsMap.sun;
    if (mode === 'dark') return iconsMap.moon;
    return iconsMap.monitor; // auto mode
  };

  const getLabel = () => {
    if (mode === 'light') return 'Yorug';
    if (mode === 'dark') return "Qorong'i";
    return 'Avto';
  };

  return (
    <Button
      variant="text"
      iconColor="primary"
      onClick={handleThemeToggle}
      className={styles['theme-toggle']}
      title={getLabel()}
    >
      <span className={styles['theme-icon']}>{getIcon()}</span>
    </Button>
  );
};

export default ThemeSelector;
