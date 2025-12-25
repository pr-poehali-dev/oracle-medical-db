import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: any;
  patients: any[];
  doctors: any[];
  onSave: (data: any) => void;
}

export function AppointmentDialog({ open, onOpenChange, appointment, patients, doctors, onSave }: AppointmentDialogProps) {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    status: 'scheduled',
  });

  useEffect(() => {
    if (appointment) {
      const date = new Date(appointment.appointment_date);
      const formattedDate = date.toISOString().slice(0, 16);
      setFormData({
        patient_id: appointment.patient_id?.toString() || '',
        doctor_id: appointment.doctor_id?.toString() || '',
        appointment_date: formattedDate,
        status: appointment.status || 'scheduled',
      });
    } else {
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_date: '',
        status: 'scheduled',
      });
    }
  }, [appointment, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      patient_id: parseInt(formData.patient_id),
      doctor_id: parseInt(formData.doctor_id),
      appointment_date: formData.appointment_date,
      status: formData.status,
    };
    onSave(appointment ? { ...dataToSend, appointment_id: appointment.appointment_id } : dataToSend);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{appointment ? 'Редактировать приём' : 'Создать приём'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="patient_id">Пациент</Label>
              <Select
                value={formData.patient_id}
                onValueChange={(value) => setFormData({ ...formData, patient_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пациента" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.patient_id} value={patient.patient_id.toString()}>
                      {patient.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="doctor_id">Врач</Label>
              <Select
                value={formData.doctor_id}
                onValueChange={(value) => setFormData({ ...formData, doctor_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите врача" />
                </SelectTrigger>
                <SelectContent>
                  {doctors.map((doctor) => (
                    <SelectItem key={doctor.doctor_id} value={doctor.doctor_id.toString()}>
                      {doctor.full_name} - {doctor.specialization}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="appointment_date">Дата и время</Label>
              <Input
                id="appointment_date"
                type="datetime-local"
                value={formData.appointment_date}
                onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Запланирован</SelectItem>
                  <SelectItem value="completed">Завершён</SelectItem>
                  <SelectItem value="cancelled">Отменён</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
