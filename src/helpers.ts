import { DraggableLocation } from 'react-beautiful-dnd';

import { Card, CardPosition } from '@/types';

export function toRecord<T extends Record<string, any>, K extends keyof T>(array: T[], selector: K): Record<T[K], T> {
  return array.reduce((acc, item) => ({ ...acc, [item[selector]]: item }), {} as Record<T[K], T>);
}

export function groupBy<T extends Record<string, any>, K extends keyof T>(array: T[], selector: K): Record<T[K], T[]> {
  return array.reduce((acc, item) => {
    (acc[item[selector]] = acc[item[selector]] || []).push(item);

    return acc;
  }, {} as Record<T[K], T[]>);
}

export function swap<T>(items: T[], source: number, destination: number): T[] {
  const newItems = [...items];
  const removed = newItems.splice(source, 1);
  newItems.splice(destination, 0, removed[0]);

  return newItems;
}

type Obj = {
  [key: string]: any;
};

export function noUndefined(obj: Obj) {
  const newObj = { ...obj };
  Object.keys(newObj).forEach((key) => newObj[key] === undefined && delete newObj[key]);

  return newObj;
}

export function normalizePosition(
  cards: Card[],
  source: DraggableLocation,
  destination: DraggableLocation
): [CardPosition | undefined, CardPosition | undefined] {
  let d = 0;
  let from = -1;
  let to = -1;

  for (let i = 0, s = 0; i < cards.length; i++) {
    if (from === -1 && cards[i].category_id === source.droppableId) {
      if (s === source.index) {
        from = i;
      }
      s++;
    }

    if (to === -1 && cards[i].category_id === destination.droppableId) {
      if (d === destination.index) {
        to = i;
      }
      d++;
    }

    if (from > -1 && to > -1) {
      break;
    }
  }

  if (-1 === from) {
    return [undefined, undefined];
  }

  if (-1 === to) {
    to = d;
  }

  return [
    {
      category_id: source.droppableId,
      index: from,
    },
    {
      category_id: destination.droppableId,
      index: to,
    },
  ];
}
