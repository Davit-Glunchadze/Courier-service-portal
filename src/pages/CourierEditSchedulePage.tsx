import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button, Typography } from '@mui/material';
import { supabase } from '../utils/supabase';
import { useAppSelector } from '../app/hooks';
import { useNavigate } from 'react-router-dom';
import WorkingDaySelector from '../features/courier/components/WorkingDaySelector';
import type { CourierRegisterInput } from '../types/courier';
//მხოლოდ workingDays ტიპი გამოვიყენე მთავარი ინტერფეისიდან
type WorkingScheduleForm = {
  workingDays: CourierRegisterInput['workingDays'];
};

const CourierEditSchedulePage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [invalid, setInvalid] = useState(false);

  const form = useForm<WorkingScheduleForm>({
    defaultValues: {
      workingDays: [],
    },
  });

  // ავტო-ლოდინგი არსებული განრიგის
  useEffect(() => {
    const loadSchedule = async () => {
      if (!user?.email) return;

      const { data } = await supabase
        .from('couriers')
        .select('workingDays')
        .eq('email', user.email)
        .single();

      if (data?.workingDays) {
        form.setValue('workingDays', data.workingDays);
      }
    };

    loadSchedule();
  }, [user]);

  // შენახვა Supabase-ში
  const onSubmit = async (values: WorkingScheduleForm) => {
    const { error } = await supabase
      .from('couriers')
      .update({ workingDays: values.workingDays })
      .eq('email', user?.email);

    if (!error) {
      navigate('/courier/dashboard');
    } else {
      alert('Failed to update schedule');
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" mb={2}>
        Edit Your Working Schedule
      </Typography>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <WorkingDaySelector control={form.control} onValidationChange={setInvalid} />

        <Box mt={3}>
          <Button type="submit" variant="contained" disabled={invalid}>
            Save Schedule
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default CourierEditSchedulePage;
