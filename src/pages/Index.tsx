import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { PatientDialog } from '@/components/PatientDialog';
import { AppointmentDialog } from '@/components/AppointmentDialog';
import { DoctorDialog } from '@/components/DoctorDialog';
import { ServiceDialog } from '@/components/ServiceDialog';
import { DiagnosisDialog } from '@/components/DiagnosisDialog';
import { DepartmentDialog } from '@/components/DepartmentDialog';
import { RecordDialog } from '@/components/RecordDialog';
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

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({ patients: 0, todayAppointments: 0, doctors: 0, departments: 0 });
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [diagnoses, setDiagnoses] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [specializations, setSpecializations] = useState<any[]>([]);
  
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [doctorDialogOpen, setDoctorDialogOpen] = useState(false);
  const [serviceDialogOpen, setServiceDialogOpen] = useState(false);
  const [diagnosisDialogOpen, setDiagnosisDialogOpen] = useState(false);
  const [departmentDialogOpen, setDepartmentDialogOpen] = useState(false);
  const [recordDialogOpen, setRecordDialogOpen] = useState(false);
  
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<any>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number } | null>(null);
  const { toast } = useToast();

  const sections = [
    { id: 'dashboard', name: 'Главная', icon: 'LayoutDashboard' },
    { id: 'patients', name: 'Пациенты', icon: 'Users' },
    { id: 'appointments', name: 'Приёмы', icon: 'Calendar' },
    { id: 'records', name: 'Медкарты', icon: 'FileText' },
    { id: 'doctors', name: 'Врачи', icon: 'Stethoscope' },
    { id: 'services', name: 'Услуги', icon: 'Package' },
    { id: 'diagnoses', name: 'Диагнозы', icon: 'ClipboardList' },
    { id: 'departments', name: 'Отделения', icon: 'Building2' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (activeSection === 'patients') {
      loadPatients();
    } else if (activeSection === 'appointments') {
      loadAppointments();
    } else if (activeSection === 'doctors') {
      loadDoctors();
    } else if (activeSection === 'services') {
      loadServices();
    } else if (activeSection === 'diagnoses') {
      loadDiagnoses();
    } else if (activeSection === 'departments') {
      loadDepartments();
    } else if (activeSection === 'records') {
      loadRecords();
    }
  }, [activeSection]);

  const loadData = async () => {
    try {
      const [statsData, doctorsData] = await Promise.all([
        api.getStats(),
        api.getDoctors(),
      ]);
      setStats(statsData);
      setDoctors(doctorsData);
    } catch (error) {
      toast({ title: 'Ошибка загрузки данных', variant: 'destructive' });
    }
  };

  const loadPatients = async () => {
    try {
      const data = await api.getPatients(searchQuery);
      setPatients(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки пациентов', variant: 'destructive' });
    }
  };

  const loadAppointments = async () => {
    try {
      const data = await api.getAppointments();
      setAppointments(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки приёмов', variant: 'destructive' });
    }
  };

  const loadDoctors = async () => {
    try {
      const [doctorsData, specsData] = await Promise.all([api.getDoctors(), api.getSpecializations()]);
      setDoctors(doctorsData);
      setSpecializations(specsData);
    } catch (error) {
      toast({ title: 'Ошибка загрузки врачей', variant: 'destructive' });
    }
  };

  const loadServices = async () => {
    try {
      const data = await api.getServices();
      setServices(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки услуг', variant: 'destructive' });
    }
  };

  const loadDiagnoses = async () => {
    try {
      const data = await api.getDiagnoses();
      setDiagnoses(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки диагнозов', variant: 'destructive' });
    }
  };

  const loadDepartments = async () => {
    try {
      const data = await api.getDepartments();
      setDepartments(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки отделений', variant: 'destructive' });
    }
  };

  const loadRecords = async () => {
    try {
      const data = await api.getRecords();
      setRecords(data);
    } catch (error) {
      toast({ title: 'Ошибка загрузки медкарт', variant: 'destructive' });
    }
  };

  const handleSavePatient = async (data: any) => {
    try {
      if (data.patient_id) {
        await api.updatePatient(data);
        toast({ title: 'Пациент обновлён' });
      } else {
        await api.createPatient(data);
        toast({ title: 'Пациент добавлен' });
      }
      setPatientDialogOpen(false);
      setSelectedPatient(null);
      loadPatients();
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleSaveAppointment = async (data: any) => {
    try {
      if (data.appointment_id) {
        await api.updateAppointment(data);
        toast({ title: 'Приём обновлён' });
      } else {
        await api.createAppointment(data);
        toast({ title: 'Приём создан' });
      }
      setAppointmentDialogOpen(false);
      setSelectedAppointment(null);
      loadAppointments();
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleSaveDoctor = async (data: any) => {
    try {
      if (data.doctor_id) {
        await api.updateDoctor(data);
        toast({ title: 'Врач обновлён' });
      } else {
        await api.createDoctor(data);
        toast({ title: 'Врач добавлен' });
      }
      setDoctorDialogOpen(false);
      setSelectedDoctor(null);
      loadDoctors();
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleSaveService = async (data: any) => {
    try {
      if (data.service_id) {
        await api.updateService(data);
        toast({ title: 'Услуга обновлена' });
      } else {
        await api.createService(data);
        toast({ title: 'Услуга добавлена' });
      }
      setServiceDialogOpen(false);
      setSelectedService(null);
      loadServices();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleSaveDiagnosis = async (data: any) => {
    try {
      if (data.diagnoses_id) {
        await api.updateDiagnosis(data);
        toast({ title: 'Диагноз обновлён' });
      } else {
        await api.createDiagnosis(data);
        toast({ title: 'Диагноз добавлен' });
      }
      setDiagnosisDialogOpen(false);
      setSelectedDiagnosis(null);
      loadDiagnoses();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleSaveDepartment = async (data: any) => {
    try {
      if (data.department_id) {
        await api.updateDepartment(data);
        toast({ title: 'Отделение обновлено' });
      } else {
        await api.createDepartment(data);
        toast({ title: 'Отделение добавлено' });
      }
      setDepartmentDialogOpen(false);
      setSelectedDepartment(null);
      loadDepartments();
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleSaveRecord = async (data: any) => {
    try {
      if (data.record_id) {
        await api.updateRecord(data);
        toast({ title: 'Медкарта обновлена' });
      } else {
        await api.createRecord(data);
        toast({ title: 'Медкарта создана' });
      }
      setRecordDialogOpen(false);
      setSelectedRecord(null);
      loadRecords();
    } catch (error) {
      toast({ title: 'Ошибка сохранения', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    try {
      if (itemToDelete.type === 'patient') {
        await api.deletePatient(itemToDelete.id);
        toast({ title: 'Пациент удалён' });
        loadPatients();
      } else if (itemToDelete.type === 'appointment') {
        await api.deleteAppointment(itemToDelete.id);
        toast({ title: 'Приём удалён' });
        loadAppointments();
      } else if (itemToDelete.type === 'doctor') {
        await api.deleteDoctor(itemToDelete.id);
        toast({ title: 'Врач удалён' });
        loadDoctors();
      } else if (itemToDelete.type === 'service') {
        await api.deleteService(itemToDelete.id);
        toast({ title: 'Услуга удалена' });
        loadServices();
      } else if (itemToDelete.type === 'diagnosis') {
        await api.deleteDiagnosis(itemToDelete.id);
        toast({ title: 'Диагноз удалён' });
        loadDiagnoses();
      } else if (itemToDelete.type === 'department') {
        await api.deleteDepartment(itemToDelete.id);
        toast({ title: 'Отделение удалено' });
        loadDepartments();
      } else if (itemToDelete.type === 'record') {
        await api.deleteRecord(itemToDelete.id);
        toast({ title: 'Медкарта удалена' });
        loadRecords();
      }
      setDeleteDialogOpen(false);
      setItemToDelete(null);
      loadData();
    } catch (error) {
      toast({ title: 'Ошибка удаления', variant: 'destructive' });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
      active: { label: 'Активен', variant: 'default' },
      inactive: { label: 'Неактивен', variant: 'secondary' },
      scheduled: { label: 'Запланирован', variant: 'default' },
      completed: { label: 'Завершён', variant: 'secondary' },
      cancelled: { label: 'Отменён', variant: 'destructive' },
    };
    const config = variants[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return '-';
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex h-screen bg-secondary/30">
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Activity" className="text-primary-foreground" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-semibold">MedSystem</h1>
              <p className="text-xs text-sidebar-foreground/60">Управление клиникой</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeSection === section.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              }`}
            >
              <Icon name={section.icon} size={20} />
              <span className="font-medium">{section.name}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center">
              <Icon name="User" size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Администратор</p>
              <p className="text-xs text-sidebar-foreground/60">admin@clinic.ru</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {activeSection === 'dashboard' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Панель управления</h2>
                    <p className="text-muted-foreground mt-1">Обзор ключевых метрик клиники</p>
                  </div>
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      setSelectedAppointment(null);
                      setAppointmentDialogOpen(true);
                    }}
                  >
                    <Icon name="Plus" size={18} />
                    Новый приём
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Пациентов</CardTitle>
                      <div className="p-2 rounded-lg bg-secondary text-blue-600">
                        <Icon name="Users" size={20} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.patients}</div>
                      <p className="text-xs text-muted-foreground mt-1">Всего в системе</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Приёмов сегодня</CardTitle>
                      <div className="p-2 rounded-lg bg-secondary text-green-600">
                        <Icon name="Calendar" size={20} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.todayAppointments}</div>
                      <p className="text-xs text-muted-foreground mt-1">Запланировано</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Врачей</CardTitle>
                      <div className="p-2 rounded-lg bg-secondary text-purple-600">
                        <Icon name="Stethoscope" size={20} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.doctors}</div>
                      <p className="text-xs text-muted-foreground mt-1">Активных специалистов</p>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow duration-200">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">Отделений</CardTitle>
                      <div className="p-2 rounded-lg bg-secondary text-orange-600">
                        <Icon name="Building2" size={20} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{stats.departments}</div>
                      <p className="text-xs text-muted-foreground mt-1">В клинике</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Calendar" size={20} />
                        Последние приёмы
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {appointments.slice(0, 3).map((appointment) => (
                          <div
                            key={appointment.appointment_id}
                            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{appointment.patient_name}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor_name} • {formatDateTime(appointment.appointment_date)}
                              </p>
                            </div>
                            {getStatusBadge(appointment.status)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="TrendingUp" size={20} />
                        Статистика приёмов
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Терапия</span>
                            <span className="font-medium">45%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '45%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Хирургия</span>
                            <span className="font-medium">28%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: '28%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Кардиология</span>
                            <span className="font-medium">18%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-orange-500" style={{ width: '18%' }} />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Другое</span>
                            <span className="font-medium">9%</span>
                          </div>
                          <div className="h-2 bg-secondary rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500" style={{ width: '9%' }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            {activeSection === 'patients' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Пациенты</h2>
                    <p className="text-muted-foreground mt-1">Управление базой пациентов</p>
                  </div>
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      setSelectedPatient(null);
                      setPatientDialogOpen(true);
                    }}
                  >
                    <Icon name="UserPlus" size={18} />
                    Добавить пациента
                  </Button>
                </div>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="relative flex-1">
                        <Icon
                          name="Search"
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          placeholder="Поиск по имени, телефону..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') loadPatients();
                          }}
                          className="pl-10"
                        />
                      </div>
                      <Button variant="outline" className="gap-2" onClick={loadPatients}>
                        <Icon name="Search" size={18} />
                        Найти
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ФИО</TableHead>
                          <TableHead>Возраст</TableHead>
                          <TableHead>Телефон</TableHead>
                          <TableHead>Дата рождения</TableHead>
                          <TableHead>Пол</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patients.map((patient) => (
                          <TableRow key={patient.patient_id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{patient.full_name}</TableCell>
                            <TableCell>{calculateAge(patient.birth_date)} лет</TableCell>
                            <TableCell>{patient.phone || '-'}</TableCell>
                            <TableCell>{formatDate(patient.birth_date)}</TableCell>
                            <TableCell>{patient.gender || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPatient(patient);
                                    setPatientDialogOpen(true);
                                  }}
                                >
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => {
                                    setItemToDelete({ type: 'patient', id: patient.patient_id });
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
              </>
            )}

            {activeSection === 'appointments' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Приёмы</h2>
                    <p className="text-muted-foreground mt-1">Управление записями на приём</p>
                  </div>
                  <Button 
                    className="gap-2"
                    onClick={() => {
                      setSelectedAppointment(null);
                      setAppointmentDialogOpen(true);
                    }}
                  >
                    <Icon name="Plus" size={18} />
                    Новый приём
                  </Button>
                </div>

                <Tabs defaultValue="all" className="w-full">
                  <TabsList>
                    <TabsTrigger value="all">Все</TabsTrigger>
                    <TabsTrigger value="today">Сегодня</TabsTrigger>
                    <TabsTrigger value="upcoming">Предстоящие</TabsTrigger>
                    <TabsTrigger value="completed">Завершённые</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="mt-6">
                    <Card>
                      <CardContent className="pt-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Пациент</TableHead>
                              <TableHead>Врач</TableHead>
                              <TableHead>Дата и время</TableHead>
                              <TableHead>Статус</TableHead>
                              <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {appointments.map((appointment) => (
                              <TableRow key={appointment.appointment_id} className="hover:bg-secondary/50">
                                <TableCell className="font-medium">{appointment.patient_name}</TableCell>
                                <TableCell>{appointment.doctor_name}</TableCell>
                                <TableCell>{formatDateTime(appointment.appointment_date)}</TableCell>
                                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        setSelectedAppointment(appointment);
                                        setAppointmentDialogOpen(true);
                                      }}
                                    >
                                      <Icon name="Edit" size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => {
                                        setItemToDelete({ type: 'appointment', id: appointment.appointment_id });
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
                  </TabsContent>
                </Tabs>
              </>
            )}

            {activeSection === 'doctors' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Врачи</h2>
                    <p className="text-muted-foreground mt-1">Управление медицинским персоналом</p>
                  </div>
                  <Button className="gap-2" onClick={() => { setSelectedDoctor(null); setDoctorDialogOpen(true); }}>
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
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedDoctor(doctor); setDoctorDialogOpen(true); }}>
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setItemToDelete({ type: 'doctor', id: doctor.doctor_id }); setDeleteDialogOpen(true); }}>
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
              </>
            )}

            {activeSection === 'services' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Услуги</h2>
                    <p className="text-muted-foreground mt-1">Управление медицинскими услугами</p>
                  </div>
                  <Button className="gap-2" onClick={() => { setSelectedService(null); setServiceDialogOpen(true); }}>
                    <Icon name="Plus" size={18} />
                    Добавить услугу
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название</TableHead>
                          <TableHead>Цена</TableHead>
                          <TableHead>Описание</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {services.map((service) => (
                          <TableRow key={service.service_id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>{service.price} ₽</TableCell>
                            <TableCell>{service.descriptions || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedService(service); setServiceDialogOpen(true); }}>
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setItemToDelete({ type: 'service', id: service.service_id }); setDeleteDialogOpen(true); }}>
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
              </>
            )}

            {activeSection === 'diagnoses' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Диагнозы</h2>
                    <p className="text-muted-foreground mt-1">Справочник диагнозов</p>
                  </div>
                  <Button className="gap-2" onClick={() => { setSelectedDiagnosis(null); setDiagnosisDialogOpen(true); }}>
                    <Icon name="Plus" size={18} />
                    Добавить диагноз
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название</TableHead>
                          <TableHead>Описание</TableHead>
                          <TableHead>Примечания</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {diagnoses.map((diagnosis) => (
                          <TableRow key={diagnosis.diagnoses_id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{diagnosis.name}</TableCell>
                            <TableCell>{diagnosis.description || '-'}</TableCell>
                            <TableCell>{diagnosis.notes || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedDiagnosis(diagnosis); setDiagnosisDialogOpen(true); }}>
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setItemToDelete({ type: 'diagnosis', id: diagnosis.diagnoses_id }); setDeleteDialogOpen(true); }}>
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
              </>
            )}

            {activeSection === 'departments' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Отделения</h2>
                    <p className="text-muted-foreground mt-1">Структура клиники</p>
                  </div>
                  <Button className="gap-2" onClick={() => { setSelectedDepartment(null); setDepartmentDialogOpen(true); }}>
                    <Icon name="Plus" size={18} />
                    Добавить отделение
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Название</TableHead>
                          <TableHead>Заведующий</TableHead>
                          <TableHead>Описание</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departments.map((dept) => (
                          <TableRow key={dept.department_id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{dept.name}</TableCell>
                            <TableCell>{dept.head_doctor || '-'}</TableCell>
                            <TableCell>{dept.description || '-'}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedDepartment(dept); setDepartmentDialogOpen(true); }}>
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setItemToDelete({ type: 'department', id: dept.department_id }); setDeleteDialogOpen(true); }}>
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
              </>
            )}

            {activeSection === 'records' && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight">Медицинские карты</h2>
                    <p className="text-muted-foreground mt-1">История болезней пациентов</p>
                  </div>
                  <Button className="gap-2" onClick={() => { setSelectedRecord(null); setRecordDialogOpen(true); }}>
                    <Icon name="Plus" size={18} />
                    Создать запись
                  </Button>
                </div>
                <Card>
                  <CardContent className="pt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Пациент</TableHead>
                          <TableHead>Врач</TableHead>
                          <TableHead>Диагноз</TableHead>
                          <TableHead>Заметки</TableHead>
                          <TableHead>Дата</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {records.map((record) => (
                          <TableRow key={record.record_id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{record.patient_name}</TableCell>
                            <TableCell>{record.doctor_name}</TableCell>
                            <TableCell>{record.diagnosis_name || '-'}</TableCell>
                            <TableCell className="max-w-xs truncate">{record.notes || '-'}</TableCell>
                            <TableCell>{formatDate(record.created_at)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm" onClick={() => { setSelectedRecord(record); setRecordDialogOpen(true); }}>
                                  <Icon name="Edit" size={16} />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setItemToDelete({ type: 'record', id: record.record_id }); setDeleteDialogOpen(true); }}>
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
              </>
            )}
          </div>
        </div>
      </main>

      <PatientDialog
        open={patientDialogOpen}
        onOpenChange={setPatientDialogOpen}
        patient={selectedPatient}
        onSave={handleSavePatient}
      />

      <AppointmentDialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
        appointment={selectedAppointment}
        patients={patients}
        doctors={doctors}
        onSave={handleSaveAppointment}
      />

      <DoctorDialog
        open={doctorDialogOpen}
        onOpenChange={setDoctorDialogOpen}
        doctor={selectedDoctor}
        specializations={specializations}
        onSave={handleSaveDoctor}
      />

      <ServiceDialog
        open={serviceDialogOpen}
        onOpenChange={setServiceDialogOpen}
        service={selectedService}
        onSave={handleSaveService}
      />

      <DiagnosisDialog
        open={diagnosisDialogOpen}
        onOpenChange={setDiagnosisDialogOpen}
        diagnosis={selectedDiagnosis}
        onSave={handleSaveDiagnosis}
      />

      <DepartmentDialog
        open={departmentDialogOpen}
        onOpenChange={setDepartmentDialogOpen}
        department={selectedDepartment}
        doctors={doctors}
        onSave={handleSaveDepartment}
      />

      <RecordDialog
        open={recordDialogOpen}
        onOpenChange={setRecordDialogOpen}
        record={selectedRecord}
        patients={patients}
        doctors={doctors}
        appointments={appointments}
        diagnoses={diagnoses}
        onSave={handleSaveRecord}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя отменить. Запись будет удалена безвозвратно.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;