export interface ApiPayload<T = unknown> {
  properties: T;
  description: string;
  _id: string;
  uid: string;
  __v: number;
}
