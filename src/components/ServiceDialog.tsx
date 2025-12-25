import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface ServiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service?: any;
  onSave: (data: any) => void;
}

export function ServiceDialog({ open, onOpenChange, service, onSave }: ServiceDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    descriptions: '',
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        price: service.price?.toString() || '',
        descriptions: service.descriptions || '',
      });
    } else {
      setFormData({
        name: '',
        price: '',
        descriptions: '',
      });
    }
  }, [service, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataToSend = {
      name: formData.name,
      price: parseFloat(formData.price) || 0,
      descriptions: formData.descriptions,
    };
    onSave(service ? { ...dataToSend, service_id: service.service_id } : dataToSend);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{service ? 'Редактировать услугу' : 'Добавить услугу'}</DialogTitle>
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
              <Label htmlFor="price">Цена (руб.)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="descriptions">Описание</Label>
              <Textarea
                id="descriptions"
                value={formData.descriptions}
                onChange={(e) => setFormData({ ...formData, descriptions: e.target.value })}
                rows={3}
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
