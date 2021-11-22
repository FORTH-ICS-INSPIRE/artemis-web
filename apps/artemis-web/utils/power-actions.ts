import { configure } from 'react-hotkeys';

export const commands = (role) => (

    role === 'admin' ? {
        Dashboard: {
            name: 'Dashboard',
            shortcut: 'alt+d',
            callback: () => (window.location.pathname = '/dashboard'),
        },
        BGPUpdates: {
            name: 'BGP Updates',
            shortcut: 'alt+b',
            callback: () => (window.location.pathname = '/bgpupdates'),
        },
        Hijacks: {
            name: 'Hijacks',
            shortcut: 'alt+h',
            callback: () => (window.location.pathname = '/hijacks'),
        },
        System: {
            name: 'System',
            shortcut: 'alt+s',
            callback: () => (window.location.pathname = '/admin/system'),
        },
        UserManagement: {
            name: 'User Management',
            shortcut: 'alt+m',
            callback: () => (window.location.pathname = '/admin/user_management'),
        },
        Password: {
            name: 'Password Change',
            shortcut: 'alt+p',
            callback: () => (window.location.pathname = '/password_change'),
        },
        Config: {
            name: 'Config Comparison',
            shortcut: 'alt+c',
            callback: () => (window.location.pathname = '/config_comparison'),
        },
    } : {
        Dashboard: {
            name: 'Dashboard',
            shortcut: 'alt+d',
            callback: () => (window.location.pathname = '/dashboard'),
        },
        BGPUpdates: {
            name: 'BGP Updates',
            shortcut: 'alt+b',
            callback: () => (window.location.pathname = '/bgpupdates'),
        },
        Hijacks: {
            name: 'Hijacks',
            shortcut: 'alt+h',
            callback: () => (window.location.pathname = '/hijacks'),
        },
        Password: {
            name: 'Password Change',
            shortcut: 'alt+p',
            callback: () => (window.location.pathname = '/password_change'),
        },
        Config: {
            name: 'Config Comparison',
            shortcut: 'alt+c',
            callback: () => (window.location.pathname = '/config_comparison'),
        },
    });
// To trigger the search modal:
// Windows + Linux OS: ctrl + Windows key (super) + k
// MacOS : cmd + k
export const keyMap = {
    TOGGLE_MODAL: 'cmd+k',
    DASHBOARD_JUMP: 'alt+d',
    BGPUPDATES_JUMP: 'alt+b',
    HIJACKS_JUMP: 'alt+h',
    SYSTEM_JUMP: 'alt+s',
    USERMANAGEMENT_JUMP: 'alt+m',
    PASSWORD_JUMP: 'alt+p',
    CONFIG_JUMP: 'alt+c',
};

export const handlers = (toggleIsOpen) => ({
    TOGGLE_MODAL: () => {
        toggleIsOpen();
    },
    DASHBOARD_JUMP: () => {
        window.location.pathname = '/dashboard';
    },
    BGPUPDATES_JUMP: () => {
        window.location.pathname = '/bgpupdates';
    },
    HIJACKS_JUMP: () => {
        window.location.pathname = '/hijacks';
    },
    SYSTEM_JUMP: () => {
        window.location.pathname = '/admin/system';
    },
    USERMANAGEMENT_JUMP: () => {
        window.location.pathname = '/admin/user_management';
    },
    PASSWORD_JUMP: () => {
        window.location.pathname = '/password_change';
    },
    CONFIG_JUMP: () => {
        window.location.pathname = '/config_comparison';
    },
});

configure({
    ignoreTags: ['input', 'select', 'textarea'],
    // ignoreEventsCondition: function () {
    // }
});
