export interface Entity {
  id: number;
  name: string;
}

export interface Lead extends Entity {
  type: 'lead';
}

export interface Object extends Entity {
  type: 'object';
}