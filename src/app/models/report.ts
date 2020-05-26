export interface Report {
    report_id: number;
    name: string;
    created_dt: Date;
    modified_dt: Date;
    status: string;
    content: any;
  }