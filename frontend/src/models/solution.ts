enum SolutionStatus {
  'PENDING' = 'PENDING',
  'RUNNING' = 'RUNNING',
  'COMPLETED' = 'COMPLETED',
}

export type Solution = {
  code: string;
  id: number;
  runtime: 'python';
  passed: number;
  total: number;
  status: SolutionStatus;
  assignment: number;
}