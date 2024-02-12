import {Timestamp} from "firebase-admin/firestore"; // 공백 제거

export interface Todo {
  id?: string;
  userId: string;
  familyId: string;
  name: string;
  title: string;
  description: string;
  completed: boolean;
  startDate?: Timestamp; // 시작일
  endDate?: Timestamp; // 종료일
  completedDate?: Timestamp; // 완료한 날짜
  createdAt?: Timestamp; // 생성일
  updatedAt?: Timestamp; // 수정일
}
// 파일의
