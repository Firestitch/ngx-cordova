
export interface RequestOptions {
  method: string;
  data: any;
  params: { [key: string]: string };
  headers: { [key: string]: string };
  serializer: string;
}
