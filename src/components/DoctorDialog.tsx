import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface DoctorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor?: any;
  specializations: any[];
  onSave: (data: any) => void;
}

export function DoctorDialog({ open, onOpenChange, doctor, specializations, onSave }: DoctorDialogProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    patronym: '',
    specialization_id: '',
    phone: '',
    office_number: '',
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        full_name: doctor.full_name || '',
        patronym: doctor.patronym || '',
        specialization_id: doctor.specialization_id?.toString() || '',
        phone: doctor.phone || '',
        office_number: doctor.office_number || '',
      });
    } else {
      setFormData({
        full_name: '',
        patronym: '',
        specialization_id: '',
        phone: '',
        office_number: '',
      });
    }
  }, [doctor, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      ...formData,
      specialization_id: formData.specialization_id ? parseInt(formData.specialization_id) : null,
    };
    onSave(doctor ? { ...dataToSend, doctor_id: doctor.doctor_id } : dataToSend);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{doctor ? 'Редактировать врача' : 'Добавить врача'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="full_name">ФИО</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="patronym">Отчество</Label>
              <Input
                id="patronym"
                value={formData.patronym}
                onChange={(e) => setFormData({ ...formData, patronym: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="specialization_id">Специализация</Label>
              <Select
                value={formData.specialization_id}
                onValueChange={(value) => setFormData({ ...formData, specialization_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите специализацию" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec.specialization_id} value={spec.specialization_id.toString()}>
                      {spec.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Телефон</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="office_number">Номер кабинета</Label>
              <Input
                id="office_number"
                value={formData.office_number}
                onChange={(e) => setFormData({ ...formData, office_number: e.target.value })}
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
