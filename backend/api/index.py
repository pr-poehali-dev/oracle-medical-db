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
            cur.execute("""
                SELECT 
                    d.doctor_id,
                    d.full_name,
                    d.phone,
                    d.office_number,
                    s.name as specialization
                FROM doctors d
                LEFT JOIN specializations s ON d.specialization_id = s.specialization_id
                ORDER BY d.full_name
            """)
            doctors = cur.fetchall()
            result = [dict(doc) for doc in doctors]
            
        elif endpoint == 'departments':
            cur.execute("""
                SELECT 
                    dep.department_id,
                    dep.name,
                    dep.description,
                    d.full_name as head_doctor
                FROM departments dep
                LEFT JOIN doctors d ON dep.doctor_id = d.doctor_id
                ORDER BY dep.name
            """)
            departments = cur.fetchall()
            result = [dict(dep) for dep in departments]
            
        elif endpoint == 'services':
            cur.execute("""
                SELECT service_id, name, price, descriptions
                FROM services
                ORDER BY name
            """)
            services = cur.fetchall()
            result = [dict(s) for s in services]
            
        elif endpoint == 'diagnoses':
            cur.execute("""
                SELECT diagnoses_id, name, description, notes
                FROM diagnoses
                ORDER BY name
            """)
            diagnoses = cur.fetchall()
            result = [dict(d) for d in diagnoses]
            
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