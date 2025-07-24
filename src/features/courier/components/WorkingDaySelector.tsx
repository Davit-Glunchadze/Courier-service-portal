import React, { useEffect } from 'react';
import {
  Box, Button, FormControl, InputLabel, MenuItem, Select, Typography,
} from '@mui/material';
import { Controller, useFieldArray, useWatch } from 'react-hook-form';
import type { Control } from 'react-hook-form';

interface Props {
  control: Control<any>;
  onValidationChange?: (hasError: boolean) => void;
}

const daysOfWeek = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

const generateTimeOptions = () => {
  const times: string[] = [];
  for (let h = 0; h < 24; h++) {
    times.push(`${String(h).padStart(2, '0')}:00`);
    times.push(`${String(h).padStart(2, '0')}:30`);
  }
  return times;
};

const timeOptions = generateTimeOptions();

const WorkingDaySelector: React.FC<Props> = ({ control, onValidationChange }) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workingDays',
  });

  const workingDays = useWatch({ control, name: 'workingDays' });

  const isDuplicateDay = (day: string, index: number) => {
    return workingDays?.some((entry: any, i: number) => i !== index && entry?.day === day);
  };

  const isInvalidTimeRange = (start: string, end: string) => {
    if (!start || !end) return true;
    return start >= end;
  };

  const handleAddDay = () => {
    append({ day: 'monday', startHours: '', endHours: '' });
  };

  const hasValidationErrors =
    fields.length < 5 ||
    workingDays?.some((day: any, i: number) =>
      isDuplicateDay(day?.day, i) || isInvalidTimeRange(day?.startHours, day?.endHours)
    );

  useEffect(() => {
    onValidationChange?.(hasValidationErrors);
  }, [hasValidationErrors, onValidationChange]);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6">Working Days</Typography>

      {fields.map((field, index) => {
        const selectedDay = workingDays?.[index]?.day;
        const start = workingDays?.[index]?.startHours;
        const end = workingDays?.[index]?.endHours;
        const showDuplicateError = selectedDay && isDuplicateDay(selectedDay, index);
        const showTimeError = isInvalidTimeRange(start, end);

        return (
          <Box key={field.id} display="flex" gap={2} alignItems="center" mt={1}>
            <Controller
              control={control}
              name={`workingDays.${index}.day`}
              render={({ field }) => (
                <FormControl fullWidth error={showDuplicateError}>
                  <InputLabel>Day</InputLabel>
                  <Select {...field} label="Day">
                    {daysOfWeek.map((day) => (
                      <MenuItem key={day} value={day}>{day}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name={`workingDays.${index}.startHours`}
              render={({ field }) => (
                <FormControl fullWidth error={showTimeError}>
                  <InputLabel>Start</InputLabel>
                  <Select {...field} label="Start">
                    {timeOptions.map((time) => (
                      <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Controller
              control={control}
              name={`workingDays.${index}.endHours`}
              render={({ field }) => (
                <FormControl fullWidth error={showTimeError}>
                  <InputLabel>End</InputLabel>
                  <Select {...field} label="End">
                    {timeOptions.map((time) => (
                      <MenuItem key={time} value={time}>{time}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />

            <Button color="error" onClick={() => remove(index)}>Remove</Button>
          </Box>
        );
      })}

      <Button
        variant="outlined"
        onClick={handleAddDay}
        sx={{ mt: 2 }}
        disabled={fields.length >= 7}
      >
        + Add Working Day
      </Button>

      {fields.length < 5 && (
        <Typography color="error" variant="body2" mt={1}>
          At least 5 working days required
        </Typography>
      )}

      {workingDays?.some((day: any, i: number) =>
        isDuplicateDay(day?.day, i) ||
        isInvalidTimeRange(day?.startHours, day?.endHours)
      ) && (
        <Typography color="error" variant="body2" mt={1}>
           Please fix duplicate days or invalid time ranges.
        </Typography>
      )}
    </Box>
  );
};

export default WorkingDaySelector;
