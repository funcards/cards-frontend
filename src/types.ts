export type ValidationErrors = {
  [key: string]: string[];
};

export type ErrorResponse = {
  type: string;
  title: string;
  status: number;
  message: string;
  errors?: ValidationErrors;
};

export type PaginatedResponse<T> = {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: T[];
};

export type SignUp = {
  name: string;
  email: string;
  password: string;
};

export type SignIn = Omit<SignUp, 'name'>;

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type User = {
  user_id: string;
  name: string;
  email: string;
};

export type Member = {
  user_id: string;
  name: string;
  email: string;
  roles: string[];
};

export type Category = {
  category_id: string;
  board_id: string;
  name: string;
  position: number;
};

export type DraftCategory = Omit<Category, 'category_id'>;

export type Tag = {
  tag_id: string;
  board_id: string;
  name: string;
  color: string;
};

export type DraftTag = Omit<Tag, 'tag_id'>;

export type Card = {
  card_id: string;
  board_id: string;
  category_id: string;
  name: string;
  content: string;
  position: number;
  tags: string[];
};

export type DraftCard = Omit<Card, 'card_id' | 'content'>;

export type Board = {
  board_id: string;
  name: string;
  color: string;
  description: string;
  created_at: string;
  members: Member[];
};

export type DraftBoard = Omit<Board, 'board_id'>;

export type ChangeCategoriesPosition = {
  board_id: string;
  source: number;
  destination: number;
};

export type CardPosition = {
  category_id: string;
  index: number;
};

export type ChangeCardsPosition = {
  board_id: string;
  source: CardPosition;
  destination: CardPosition;
};

export enum Theme {
  Sky = 'sky',
  Blue = 'blue',
  Indigo = 'indigo',
  Red = 'red',
  Pink = 'pink',
  Orange = 'orange',
  Yellow = 'yellow',
  Lime = 'lime',
  Green = 'green',
  Gray = 'gray',
  NoColor = 'no-color',
}

export enum DndType {
  Category = 'CATEGORY',
  Card = 'CARD',
}

export enum NotifyType {
  Info = 'info',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export type Notification = {
  id: string;
  type: NotifyType;
  title: string;
  message: string;
  dismiss: number;
};
