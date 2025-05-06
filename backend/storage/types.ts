export interface Task {
  id: string;
  text: string;          // description
  due: string;           // mm/dd/yy
  done: boolean;         // true = completed
  indent?: number;       // optional nesting level
}