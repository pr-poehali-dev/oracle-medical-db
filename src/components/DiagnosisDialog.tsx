import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DiagnosisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  diagnosis?: any;
  onSave: (data: any) => void;
}

export function DiagnosisDialog({ open, onOpenChange, diagnosis, onSave }: DiagnosisDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    notes: '',
  });

  useEffect(() => {
    if (diagnosis) {
      setFormData({
        name: diagnosis.name || '',
        description: diagnosis.description || '',
        notes: diagnosis.notes || '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        notes: '',
      });
    }
  }, [diagnosis, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(diagnosis ? { ...formData, diagnoses_id: diagnosis.diagnoses_id } : formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{diagnosis ? 'Редактировать диагноз' : 'Добавить диагноз'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Название</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Примечания</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
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
