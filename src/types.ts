export type AppID = string;

export interface WindowState {
  id: AppID;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  isShaded?: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  props?: any;
}

export interface AppConfig {
  id: AppID;
  name: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
}
