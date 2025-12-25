import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from datetime import datetime

def get_db_connection():
    """Создание подключения к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event, context):
    """API для работы с медицинской системой"""
    
    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    query_params = event.get('queryStringParameters') or {}
    body_data = {}
    
    if event.get('body'):
        try:
            body_data = json.loads(event.get('body'))
        except:
            pass
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    
    try:
        endpoint = query_params.get('endpoint', 'stats')
        
        if endpoint == 'stats':
            cur.execute("SELECT COUNT(*) as total FROM patients")
            patients_count = cur.fetchone()['total']
            
            cur.execute("SELECT COUNT(*) as total FROM appointments WHERE DATE(appointment_date) = CURRENT_DATE")
            today_appointments = cur.fetchone()['total']
            
            cur.execute("SELECT COUNT(*) as total FROM doctors")
            doctors_count = cur.fetchone()['total']
            
            cur.execute("SELECT COUNT(*) as total FROM departments")
            departments_count = cur.fetchone()['total']
            
            result = {
                'patients': patients_count,
                'todayAppointments': today_appointments,
                'doctors': doctors_count,
                'departments': departments_count
            }
            
        elif endpoint == 'patients':
            if method == 'GET':
                limit = int(query_params.get('limit', 100))
                search = query_params.get('search', '')
                
                if search:
                    cur.execute(
                        "SELECT patient_id, full_name, birth_date, gender, phone, passport_info, created_at FROM patients WHERE full_name ILIKE %s OR phone ILIKE %s ORDER BY created_at DESC LIMIT %s",
                        (f'%{search}%', f'%{search}%', limit)
                    )
                else:
                    cur.execute(
                        "SELECT patient_id, full_name, birth_date, gender, phone, passport_info, created_at FROM patients ORDER BY created_at DESC LIMIT %s",
                        (limit,)
                    )
                
                patients = cur.fetchall()
                result = [dict(p) for p in patients]
                
            elif method == 'POST':
                cur.execute(
                    "INSERT INTO patients (full_name, birth_date, gender, phone, passport_info) VALUES (%s, %s, %s, %s, %s) RETURNING patient_id",
                    (body_data.get('full_name'), body_data.get('birth_date'), body_data.get('gender'), body_data.get('phone'), body_data.get('passport_info'))
                )
                patient_id = cur.fetchone()['patient_id']
                conn.commit()
                result = {'success': True, 'patient_id': patient_id}
                
            elif method == 'PUT':
                patient_id = body_data.get('patient_id')
                cur.execute(
                    "UPDATE patients SET full_name=%s, birth_date=%s, gender=%s, phone=%s, passport_info=%s WHERE patient_id=%s",
                    (body_data.get('full_name'), body_data.get('birth_date'), body_data.get('gender'), body_data.get('phone'), body_data.get('passport_info'), patient_id)
                )
                conn.commit()
                result = {'success': True}
                
            elif method == 'DELETE':
                patient_id = query_params.get('id')
                cur.execute("DELETE FROM appointments WHERE patient_id=%s", (patient_id,))
                cur.execute("DELETE FROM medicalrecords WHERE patient_id=%s", (patient_id,))
                cur.execute("DELETE FROM patients WHERE patient_id=%s", (patient_id,))
                conn.commit()
                result = {'success': True}
            
        elif endpoint == 'appointments':
            if method == 'GET':
                limit = int(query_params.get('limit', 100))
                status_filter = query_params.get('status')
                
                query = """
                    SELECT 
                        a.appointment_id,
                        a.patient_id,
                        a.doctor_id,
                        a.appointment_date,
                        a.status,
                        p.full_name as patient_name,
                        d.full_name as doctor_name,
                        s.name as specialization
                    FROM appointments a
                    JOIN patients p ON a.patient_id = p.patient_id
                    JOIN doctors d ON a.doctor_id = d.doctor_id
                    LEFT JOIN specializations s ON d.specialization_id = s.specialization_id
                """
                
                params = []
                if status_filter:
                    query += " WHERE a.status = %s"
                    params.append(status_filter)
                
                query += " ORDER BY a.appointment_date DESC LIMIT %s"
                params.append(limit)
                
                cur.execute(query, tuple(params))
                appointments = cur.fetchall()
                result = [dict(a) for a in appointments]
                
            elif method == 'POST':
                cur.execute(
                    "INSERT INTO appointments (patient_id, doctor_id, appointment_date, status) VALUES (%s, %s, %s, %s) RETURNING appointment_id",
                    (body_data.get('patient_id'), body_data.get('doctor_id'), body_data.get('appointment_date'), body_data.get('status', 'scheduled'))
                )
                appointment_id = cur.fetchone()['appointment_id']
                conn.commit()
                result = {'success': True, 'appointment_id': appointment_id}
                
            elif method == 'PUT':
                appointment_id = body_data.get('appointment_id')
                cur.execute(
                    "UPDATE appointments SET patient_id=%s, doctor_id=%s, appointment_date=%s, status=%s WHERE appointment_id=%s",
                    (body_data.get('patient_id'), body_data.get('doctor_id'), body_data.get('appointment_date'), body_data.get('status'), appointment_id)
                )
                conn.commit()
                result = {'success': True}
                
            elif method == 'DELETE':
                appointment_id = query_params.get('id')
                cur.execute("DELETE FROM appointmentservices WHERE appointment_id=%s", (appointment_id,))
                cur.execute("DELETE FROM medicalrecords WHERE appointment_id=%s", (appointment_id,))
                cur.execute("DELETE FROM appointments WHERE appointment_id=%s", (appointment_id,))
                conn.commit()
                result = {'success': True}
            
        elif endpoint == 'doctors':
            if method == 'GET':
                cur.execute("""
                    SELECT 
                        d.doctor_id,
                        d.full_name,
                        d.patronym,
                        d.specialization_id,
                        d.phone,
                        d.office_number,
                        s.name as specialization
                    FROM doctors d
                    LEFT JOIN specializations s ON d.specialization_id = s.specialization_id
                    ORDER BY d.full_name
                """)
                doctors = cur.fetchall()
                result = [dict(doc) for doc in doctors]
                
            elif method == 'POST':
                cur.execute(
                    "INSERT INTO doctors (full_name, patronym, specialization_id, phone, office_number) VALUES (%s, %s, %s, %s, %s) RETURNING doctor_id",
                    (body_data.get('full_name'), body_data.get('patronym'), body_data.get('specialization_id'), body_data.get('phone'), body_data.get('office_number'))
                )
                doctor_id = cur.fetchone()['doctor_id']
                conn.commit()
                result = {'success': True, 'doctor_id': doctor_id}
                
            elif method == 'PUT':
                doctor_id = body_data.get('doctor_id')
                cur.execute(
                    "UPDATE doctors SET full_name=%s, patronym=%s, specialization_id=%s, phone=%s, office_number=%s WHERE doctor_id=%s",
                    (body_data.get('full_name'), body_data.get('patronym'), body_data.get('specialization_id'), body_data.get('phone'), body_data.get('office_number'), doctor_id)
                )
                conn.commit()
                result = {'success': True}
                
            elif method == 'DELETE':
                doctor_id = query_params.get('id')
                cur.execute("DELETE FROM appointments WHERE doctor_id=%s", (doctor_id,))
                cur.execute("DELETE FROM medicalrecords WHERE doctor_id=%s", (doctor_id,))
                cur.execute("DELETE FROM departments WHERE doctor_id=%s", (doctor_id,))
                cur.execute("DELETE FROM doctors WHERE doctor_id=%s", (doctor_id,))
                conn.commit()
                result = {'success': True}
        
        elif endpoint == 'specializations':
            cur.execute("SELECT specialization_id, name, description FROM specializations ORDER BY name")
            specs = cur.fetchall()
            result = [dict(s) for s in specs]
            
        elif endpoint == 'departments':
            if method == 'GET':
                cur.execute("""
                    SELECT 
                        dep.department_id,
                        dep.name,
                        dep.description,
                        dep.doctor_id,
                        d.full_name as head_doctor
                    FROM departments dep
                    LEFT JOIN doctors d ON dep.doctor_id = d.doctor_id
                    ORDER BY dep.name
                """)
                departments = cur.fetchall()
                result = [dict(dep) for dep in departments]
                
            elif method == 'POST':
                cur.execute(
                    "INSERT INTO departments (name, description, doctor_id) VALUES (%s, %s, %s) RETURNING department_id",
                    (body_data.get('name'), body_data.get('description'), body_data.get('doctor_id'))
                )
                department_id = cur.fetchone()['department_id']
                conn.commit()
                result = {'success': True, 'department_id': department_id}
                
            elif method == 'PUT':
                department_id = body_data.get('department_id')
                cur.execute(
                    "UPDATE departments SET name=%s, description=%s, doctor_id=%s WHERE department_id=%s",
                    (body_data.get('name'), body_data.get('description'), body_data.get('doctor_id'), department_id)
                )
                conn.commit()
                result = {'success': True}
                
            elif method == 'DELETE':
                department_id = query_params.get('id')
                cur.execute("DELETE FROM departments WHERE department_id=%s", (department_id,))
                conn.commit()
                result = {'success': True}
            
        elif endpoint == 'services':
            if method == 'GET':
                cur.execute("""
                    SELECT service_id, name, price, descriptions
                    FROM services
                    ORDER BY name
                """)
                services = cur.fetchall()
                result = [dict(s) for s in services]
                
            elif method == 'POST':
                cur.execute(
                    "INSERT INTO services (name, price, descriptions) VALUES (%s, %s, %s) RETURNING service_id",
                    (body_data.get('name'), body_data.get('price'), body_data.get('descriptions'))
                )
                service_id = cur.fetchone()['service_id']
                conn.commit()
                result = {'success': True, 'service_id': service_id}
                
            elif method == 'PUT':
                service_id = body_data.get('service_id')
                cur.execute(
                    "UPDATE services SET name=%s, price=%s, descriptions=%s WHERE service_id=%s",
                    (body_data.get('name'), body_data.get('price'), body_data.get('descriptions'), service_id)
                )
                conn.commit()
                result = {'success': True}
                
            elif method == 'DELETE':
                service_id = query_params.get('id')
                cur.execute("DELETE FROM appointmentservices WHERE service_id=%s", (service_id,))
                cur.execute("DELETE FROM services WHERE service_id=%s", (service_id,))
                conn.commit()
                result = {'success': True}
            
        elif endpoint == 'diagnoses':
            if method == 'GET':
                cur.execute("""
                    SELECT diagnoses_id, name, description, notes
                    FROM diagnoses
                    ORDER BY name
                """)
                diagnoses = cur.fetchall()
                result = [dict(d) for d in diagnoses]
                
            elif method == 'POST':
                cur.execute(
                    "INSERT INTO diagnoses (name, description, notes) VALUES (%s, %s, %s) RETURNING diagnoses_id",
                    (body_data.get('name'), body_data.get('description'), body_data.get('notes'))
                )
                diagnoses_id = cur.fetchone()['diagnoses_id']
                conn.commit()
                result = {'success': True, 'diagnoses_id': diagnoses_id}
                
            elif method == 'PUT':
                diagnoses_id = body_data.get('diagnoses_id')
                cur.execute(
                    "UPDATE diagnoses SET name=%s, description=%s, notes=%s WHERE diagnoses_id=%s",
                    (body_data.get('name'), body_data.get('description'), body_data.get('notes'), diagnoses_id)
                )
                conn.commit()
                result = {'success': True}
                
            elif method == 'DELETE':
                diagnoses_id = query_params.get('id')
                cur.execute("DELETE FROM medicalrecords WHERE diagnoses_id=%s", (diagnoses_id,))
                cur.execute("DELETE FROM diseases WHERE diagnoses_id=%s", (diagnoses_id,))
                cur.execute("DELETE FROM diagnoses WHERE diagnoses_id=%s", (diagnoses_id,))
                conn.commit()
                result = {'success': True}
        
        elif endpoint == 'records':
            if method == 'GET':
                limit = int(query_params.get('limit', 100))
                cur.execute("""
                    SELECT 
                        mr.record_id,
                        mr.patient_id,
                        mr.doctor_id,
                        mr.appointment_id,
                        mr.diagnoses_id,
                        mr.notes,
                        mr.created_at,
                        p.full_name as patient_name,
                        d.full_name as doctor_name,
                        diag.name as diagnosis_name
                    FROM medicalrecords mr
                    JOIN patients p ON mr.patient_id = p.patient_id
                    JOIN doctors d ON mr.doctor_id = d.doctor_id
                    LEFT JOIN diagnoses diag ON mr.diagnoses_id = diag.diagnoses_id
                    ORDER BY mr.created_at DESC
                    LIMIT %s
                """, (limit,))
                records = cur.fetchall()
                result = [dict(r) for r in records]
                
            elif method == 'POST':
                cur.execute(
                    "INSERT INTO medicalrecords (patient_id, doctor_id, appointment_id, diagnoses_id, notes) VALUES (%s, %s, %s, %s, %s) RETURNING record_id",
                    (body_data.get('patient_id'), body_data.get('doctor_id'), body_data.get('appointment_id'), body_data.get('diagnoses_id'), body_data.get('notes'))
                )
                record_id = cur.fetchone()['record_id']
                conn.commit()
                result = {'success': True, 'record_id': record_id}
                
            elif method == 'PUT':
                record_id = body_data.get('record_id')
                cur.execute(
                    "UPDATE medicalrecords SET patient_id=%s, doctor_id=%s, appointment_id=%s, diagnoses_id=%s, notes=%s WHERE record_id=%s",
                    (body_data.get('patient_id'), body_data.get('doctor_id'), body_data.get('appointment_id'), body_data.get('diagnoses_id'), body_data.get('notes'), record_id)
                )
                conn.commit()
                result = {'success': True}
                
            elif method == 'DELETE':
                record_id = query_params.get('id')
                cur.execute("DELETE FROM prescriptions WHERE record_id=%s", (record_id,))
                cur.execute("DELETE FROM medicalrecords WHERE record_id=%s", (record_id,))
                conn.commit()
                result = {'success': True}
            
        else:
            result = {'error': 'Unknown endpoint'}
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps(result, default=str),
            'isBase64Encoded': False
        }
        
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    finally:
        cur.close()
        conn.close()