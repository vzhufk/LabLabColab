
export type Lab = {
  id: number;
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  description: any;
  input: string;
  output: string;
  explanation: string;
  topic: number;
};