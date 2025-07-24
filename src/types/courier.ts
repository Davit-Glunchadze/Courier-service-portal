
// ტიპი კურიერის სამუშაო დღეების განსაზღვრისთვის
export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';


// სამუშო დღეები და სამუშაო საათები კურიერისთვის
export interface WorkingDay {
  day: DayOfWeek;
  startHours: string;
  endHours: string;
}

//  კურიერის რეგისტრაციის მონაცემები
export interface CourierRegisterInput {
  role: 'courier';
  firstName: string;
  lastName?: string;
  pid: string;
  phoneNumber: string;
  email: string;
  password: string;
  profileImage?: string;
  vehicle: string;
  workingDays: WorkingDay[];
}
