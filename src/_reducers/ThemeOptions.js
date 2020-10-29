import background_image from 'assets/utils/images/sidebar/abstract4.jpg';

export const SET_ENABLE_BACKGROUND_IMAGE = 'THEME_OPTIONS/SET_ENABLE_BACKGROUND_IMAGE';

export const SET_ENABLE_MOBILE_MENU = 'THEME_OPTIONS/SET_ENABLE_MOBILE_MENU';
export const SET_ENABLE_MOBILE_MENU_SMALL = 'THEME_OPTIONS/SET_ENABLE_MOBILE_MENU_SMALL';
export const SET_ENABLE_CLOSED_SIDEBAR = 'THEME_OPTIONS/SET_ENABLE_CLOSED_SIDEBAR';

export const setEnableClosedSidebar = enableClosedSidebar => ({
    type: SET_ENABLE_CLOSED_SIDEBAR,
    enableClosedSidebar
});

export const setEnableMobileMenu = enableMobileMenu => ({
    type: SET_ENABLE_MOBILE_MENU,
    enableMobileMenu
});

export const setEnableMobileMenuSmall = enableMobileMenuSmall => ({
    type: SET_ENABLE_MOBILE_MENU_SMALL,
    enableMobileMenuSmall
});

export default function reducer(state = {
    backgroundColor: 'sidebar-text-light',
    headerBackgroundColor: 'bg-strong-bliss header-text-light',
    enableMobileMenuSmall: '',
    enableBackgroundImage: true,
    enableFixedHeader: true,
    colorScheme: 'white',
    backgroundImage: background_image,

}, action) {
    switch (action.type) {

        case SET_ENABLE_CLOSED_SIDEBAR:
            return {
                ...state,
                enableClosedSidebar: action.enableClosedSidebar
            };

        default:
            return state;
    }
}