import { ThemeServiceConfig } from '@bcodes/ngx-theme-service';

const themeServiceConfig: ThemeServiceConfig = {
    themes: ['light', 'dark'],
    defaultTheme: 'light',
    transitionConfig: {
        className: 'theme-transition',
        duration: 1000,
    },
};

export const COMMON_CONSTANTS = {
    themeServiceConfig,
};
