export type SiteStatus = "online" | "offline" | "unknown";

export interface Site {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string;
  enabled: boolean;
  featured: boolean;
  sourceUrl?: string;
  domesticUrl?: string;
  /** 空字符串或 "auto" = 用首字母；emoji = 直接用；http(s) = 图片 */
  logo?: string;
  visitors: number;
  status: SiteStatus;
  tags?: string[];
  createdAt?: string;
  order?: number;
}

export interface Message {
  id: string;
  nickname: string;
  content: string;
  createdAt: string;
}

export interface Settings {
  siteName: string;
  slogan: string;
  description: string;
  avatar?: string;
  github?: string;
  footer?: string;
  onlineBaseline?: number;
  onlineRange?: number;
}

export interface SiteData {
  sites: Site[];
}

export interface MessageData {
  messages: Message[];
}

export interface CombinedData {
  sites: Site[];
  messages: Message[];
  settings: Settings;
}

export type AdminAction =
  | { type: "saveSites"; sites: Site[] }
  | { type: "deleteMessage"; id: string };
