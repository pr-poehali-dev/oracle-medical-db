import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const mockPatients = [
  { id: 1, name: 'Иванов Иван Иванович', age: 45, phone: '+7 (999) 123-45-67', lastVisit: '15.12.2024', status: 'active' },
  { id: 2, name: 'Петрова Мария Сергеевна', age: 32, phone: '+7 (999) 234-56-78', lastVisit: '20.12.2024', status: 'active' },
  { id: 3, name: 'Сидоров Петр Алексеевич', age: 58, phone: '+7 (999) 345-67-89', lastVisit: '10.12.2024', status: 'inactive' },
  { id: 4, name: 'Козлова Анна Дмитриевна', age: 28, phone: '+7 (999) 456-78-90', lastVisit: '22.12.2024', status: 'active' },
];

const mockAppointments = [
  { id: 1, patient: 'Иванов Иван Иванович', doctor: 'Смирнов А.П.', date: '25.12.2024', time: '10:00', status: 'scheduled' },
  { id: 2, patient: 'Петрова Мария Сергеевна', doctor: 'Кузнецова Е.В.', date: '25.12.2024', time: '11:30', status: 'scheduled' },
  { id: 3, patient: 'Козлова Анна Дмитриевна', doctor: 'Попов В.И.', date: '25.12.2024', time: '14:00', status: 'completed' },
  { id: 4, patient: 'Сидоров Петр Алексеевич', doctor: 'Смирнов А.П.', date: '26.12.2024', time: '09:00', status: 'scheduled' },
];

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { title: 'Пациентов', value: '1,247', icon: 'Users', trend: '+12%', color: 'text-blue-600' },
    { title: 'Приёмов сегодня', value: '24', icon: 'Calendar', trend: '+5%', color: 'text-green-600' },
    { title: 'Врачей', value: '18', icon: 'Stethoscope', trend: '+2', color: 'text-purple-600' },
    { title: 'Отделений', value: '6', icon: 'Building2', trend: '0', color: 'text-orange-600' },
  ];

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
                  <Button className="gap-2">
                    <Icon name="Plus" size={18} />
                    Новый приём
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-lg bg-secondary ${stat.color}`}>
                          <Icon name={stat.icon} size={20} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {stat.trend} за месяц
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Calendar" size={20} />
                        Приёмы на сегодня
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockAppointments.slice(0, 3).map((appointment) => (
                          <div
                            key={appointment.id}
                            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium">{appointment.patient}</p>
                              <p className="text-sm text-muted-foreground">
                                {appointment.doctor} • {appointment.time}
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
                  <Button className="gap-2">
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
                          className="pl-10"
                        />
                      </div>
                      <Button variant="outline" className="gap-2">
                        <Icon name="Filter" size={18} />
                        Фильтры
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
                          <TableHead>Последний визит</TableHead>
                          <TableHead>Статус</TableHead>
                          <TableHead className="text-right">Действия</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockPatients.map((patient) => (
                          <TableRow key={patient.id} className="hover:bg-secondary/50">
                            <TableCell className="font-medium">{patient.name}</TableCell>
                            <TableCell>{patient.age} лет</TableCell>
                            <TableCell>{patient.phone}</TableCell>
                            <TableCell>{patient.lastVisit}</TableCell>
                            <TableCell>{getStatusBadge(patient.status)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Icon name="Eye" size={16} />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Icon name="Edit" size={16} />
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
                  <Button className="gap-2">
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
                              <TableHead>Дата</TableHead>
                              <TableHead>Время</TableHead>
                              <TableHead>Статус</TableHead>
                              <TableHead className="text-right">Действия</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {mockAppointments.map((appointment) => (
                              <TableRow key={appointment.id} className="hover:bg-secondary/50">
                                <TableCell className="font-medium">{appointment.patient}</TableCell>
                                <TableCell>{appointment.doctor}</TableCell>
                                <TableCell>{appointment.date}</TableCell>
                                <TableCell>{appointment.time}</TableCell>
                                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Icon name="Eye" size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm">
                                      <Icon name="Edit" size={16} />
                                    </Button>
                                    <Button variant="ghost" size="sm">
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

            {!['dashboard', 'patients', 'appointments'].includes(activeSection) && (
              <Card className="p-12 text-center">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                    <Icon name="Construction" size={32} className="text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">Раздел в разработке</h3>
                    <p className="text-muted-foreground mt-2">
                      Функционал раздела "{sections.find(s => s.id === activeSection)?.name}" скоро будет доступен
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
