export type HealthResponse = {
  status: string;
  app: string;
  env: string;
  version: string;
};

export type Item = {
  id: number;
  name: string;
  description: string | null;
  /** Pydantic serialize Decimal thành string */
  price: string;
  is_active: boolean;
  created_at: string;
};

export type ItemListResponse = {
  items: Item[];
  total: number;
};

export type ItemCreatePayload = {
  name: string;
  description?: string | null;
  price: string;
  is_active?: boolean;
};
