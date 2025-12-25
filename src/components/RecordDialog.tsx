import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface RecordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record?: any;
  patients: any[];
  doctors: any[];
  appointments: any[];
  diagnoses: any[];
  onSave: (data: any) => void;
}

export function RecordDialog({ open, onOpenChange, record, patients, doctors, appointments, diagnoses, onSave }: RecordDialogProps) {
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_id: '',
    diagnoses_id: '',
    notes: '',
  });

  useEffect(() => {
    if (record) {
      setFormData({
        patient_id: record.patient_id?.toString() || '',
        doctor_id: record.doctor_id?.toString() || '',
        appointment_id: record.appointment_id?.toString() || '',
        diagnoses_id: record.diagnoses_id?.toString() || '',
        notes: record.notes || '',
      });
    } else {
      setFormData({
        patient_id: '',
        doctor_id: '',
        appointment_id: '',
        diagnoses_id: '',
        notes: '',
      });
    }
  }, [record, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      patient_id: parseInt(formData.patient_id),
      doctor_id: parseInt(formData.doctor_id),
      appointment_id: formData.appointment_id ? parseInt(formData.appointment_id) : null,
      diagnoses_id: formData.diagnoses_id ? parseInt(formData.diagnoses_id) : null,
      notes: formData.notes,
    };
    onSave(record ? { ...dataToSend, record_id: record.record_id } : dataToSend);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{record ? 'Редактировать медкарту' : 'Создать медкарту'}</DialogTitle>
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
                      {doctor.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="appointment_id">Приём (опционально)</Label>
              <Select
                value={formData.appointment_id}
                onValueChange={(value) => setFormData({ ...formData, appointment_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите приём" />
                </SelectTrigger>
                <SelectContent>
                  {appointments.map((appointment) => (
                    <SelectItem key={appointment.appointment_id} value={appointment.appointment_id.toString()}>
                      {appointment.patient_name} - {appointment.doctor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diagnoses_id">Диагноз (опционально)</Label>
              <Select
                value={formData.diagnoses_id}
                onValueChange={(value) => setFormData({ ...formData, diagnoses_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите диагноз" />
                </SelectTrigger>
                <SelectContent>
                  {diagnoses.map((diagnosis) => (
                    <SelectItem key={diagnosis.diagnoses_id} value={diagnosis.diagnoses_id.toString()}>
                      {diagnosis.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Заметки</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
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
