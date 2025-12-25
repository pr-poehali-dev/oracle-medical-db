import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DoctorDialog } from '@/components/DoctorDialog';
import { api } from '@/lib/api';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function DoctorsSection() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [doctorToDelete, setDoctorToDelete] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [doctorsData, specsData] = await Promise.all([
        api.getDoctors(),
        api.getSpecializations(),
      ]);
      setDoctors(doctorsData);
      setSpecializations(specsData);
    } catch (error) {
      toast({ title: 'Ошибка загрузки данных', variant: 'destructive' });
    }
  };

  const handleSave = async (data: any) => {
    try {
      if (data.doctor_id) {
        await api.updateDoctor(data);
        toast({ title: 'Врач обновлён' });
      } else {
        await api.createDoctor(data);
        toast({ title: 'Врач добавлен' });
      }
      setDialogOpen(false);
      setSelectedDoctor(null);
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!doctorToDelete) return;
    try {
      await api.deleteDoctor(doctorToDelete);
      toast({ title: 'Врач удалён' });
      setDeleteDialogOpen(false);
      setDoctorToDelete(null);
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Врачи</h2>
          <p className="text-muted-foreground mt-1">Управление медицинским персоналом</p>
        </div>
        <Button 
          className="gap-2"
          onClick={() => {
            setSelectedDoctor(null);
            setDialogOpen(true);
          }}
        >
          <Icon name="UserPlus" size={18} />
          Добавить врача
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ФИО</TableHead>
                <TableHead>Специализация</TableHead>
                <TableHead>Телефон</TableHead>
                <TableHead>Кабинет</TableHead>
                <TableHead className="text-right">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.doctor_id} className="hover:bg-secondary/50">
                  <TableCell className="font-medium">{doctor.full_name}</TableCell>
                  <TableCell>{doctor.specialization || '-'}</TableCell>
                  <TableCell>{doctor.phone || '-'}</TableCell>
                  <TableCell>{doctor.office_number || '-'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedDoctor(doctor);
                          setDialogOpen(true);
                        }}
                      >
                        <Icon name="Edit" size={16} />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setDoctorToDelete(doctor.doctor_id);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <DoctorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        doctor={selectedDoctor}
        specializations={specializations}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Врач будет удалён безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
