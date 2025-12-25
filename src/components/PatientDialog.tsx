import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient?: any;
  onSave: (data: any) => void;
}

export function PatientDialog({ open, onOpenChange, patient, onSave }: PatientDialogProps) {
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    gender: '',
    phone: '',
    passport_info: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        full_name: patient.full_name || '',
        birth_date: patient.birth_date || '',
        gender: patient.gender || '',
        phone: patient.phone || '',
        passport_info: patient.passport_info || '',
      });
    } else {
      setFormData({
        full_name: '',
        birth_date: '',
        gender: '',
        phone: '',
        passport_info: '',
      });
    }
  }, [patient, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(patient ? { ...formData, patient_id: patient.patient_id } : formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{patient ? 'Редактировать пациента' : 'Добавить пациента'}</DialogTitle>
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
              <Label htmlFor="birth_date">Дата рождения</Label>
              <Input
                id="birth_date"
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="gender">Пол</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите пол" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Мужской">Мужской</SelectItem>
                  <SelectItem value="Женский">Женский</SelectItem>
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
              <Label htmlFor="passport_info">Паспортные данные</Label>
              <Input
                id="passport_info"
                value={formData.passport_info}
                onChange={(e) => setFormData({ ...formData, passport_info: e.target.value })}
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
