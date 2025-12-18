import type { IconType } from 'react-icons';
import { MdHome } from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { FaCircleQuestion, FaUserLarge } from 'react-icons/fa6';
import { HiFolder, HiFolderOpen } from 'react-icons/hi';

export interface NavigationLink {
  to: string;
  label: string;
  icon: IconType;
  iconSize?: string;
  protected?: boolean;
  requiresAuth?: boolean;
}

export const sidebarNavigationLinks: NavigationLink[] = [
  {
    to: '/',
    label: 'Home',
    icon: MdHome,
    iconSize: 'size-6',
    protected: false,
    requiresAuth: false,
  },
  {
    to: '/my-account',
    label: 'My Account',
    icon: FaUserLarge,
    iconSize: 'size-5',
    protected: true,
    requiresAuth: true,
  },
  {
    to: '/post-snippet',
    label: 'Post snippet',
    icon: HiFolderOpen,
    iconSize: 'size-6',
    protected: true,
    requiresAuth: true,
  },
  {
    to: '/my-snippets',
    label: 'My snippets',
    icon: HiFolder,
    iconSize: 'size-6',
    protected: true,
    requiresAuth: true,
  },
  {
    to: '/questions',
    label: 'Questions',
    icon: FaCircleQuestion,
    iconSize: 'size-5',
    protected: false,
    requiresAuth: false,
  },
  {
    to: '/users',
    label: 'Users',
    icon: FaUsers,
    iconSize: 'size-6',
    protected: false,
    requiresAuth: false,
  },
];
