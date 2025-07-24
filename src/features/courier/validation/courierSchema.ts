import { z } from 'zod';

//დროის  HH:mm ფორმატი
const timeRegex = /^([01]\d|2[0-3]):(00|30)$/; 

// სამუშაო დღის სქემა
const workingDaySchema = z.object({
  day: z.enum([
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
  ]),
  startHours: z.string().regex(timeRegex, 'Invalid time format (HH:mm)'),
  endHours: z.string().regex(timeRegex, 'Invalid time format (HH:mm)'),
});

// კურიერის რეგისტრაციის სქემა
export const courierSchema = z.object({
  role: z.literal('courier'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().optional(),
  pid: z.string().min(11, 'PID must be 11 characters'),
  phoneNumber: z.string().min(9, 'Phone is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  profileImage: z.string().url().optional(),
  vehicle: z.string().min(1, 'Vehicle is required'),
  workingDays: z.array(workingDaySchema)
    .min(5, 'At least 5 working days are required'),
});
