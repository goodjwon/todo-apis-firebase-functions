export interface Todo {
  id?: string;
  userUID: string;
  familyId: string;
  name: string;
  title: string;
  description: string;
  isCompleted: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  completerName?: string | null;
  completerId?: string | null;
  completedDate?: Date | null;
  alarmTime?: Date | null;
  isLunarCalendar?: boolean;
  dDayAsDate?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
